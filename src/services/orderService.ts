interface OrderData {
  establishmentName: string;
  quantity: number;
  phoneNumber: string;
  city: string;
  date: Date;
}

// Clés de stockage localStorage
const ORDERS_KEY = 'cement_orders';
const WEEKLY_TOTAL_KEY = 'weekly_TOTAL';
const MONTHLY_TOTAL_KEY = 'monthly_TOTAL';
const STOCK_KEY = 'available_stock';
const STOCK_LAST_UPDATE_KEY = 'stock_last_update';
const SYNC_TIMESTAMP_KEY = 'sync_timestamp';
const ORDER_STORAGE_KEY = 'admin_orders';

// Valeurs par défaut pour les métriques du tableau de bord
const DEFAULT_WEEKLY_TOTAL = 1250; // tonnes
const DEFAULT_MONTHLY_TOTAL = 4800; // tonnes
const DEFAULT_AVAILABLE_STOCK = 2000; // tonnes

// Récupérer toutes les commandes
export const getAllOrders = (): OrderData[] => {
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

// Ajouter une nouvelle commande
export const addOrder = (order: Omit<OrderData, 'date'>): OrderData => {
  const newOrder = { ...order, date: new Date() };
  const orders = getAllOrders();
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  // Mettre à jour les totaux des commandes après l'ajout d'une commande
  updateOrderTotals(newOrder.quantity);
  
  // Forcer une synchronisation entre les clients
  triggerSyncEvent();
  
  // Synchroniser avec l'administration
  syncWithAdminOrders(newOrder);
  
  // Synchroniser avec Supabase (sans attendre la réponse pour ne pas bloquer l'UI)
  syncOrderToSupabase(newOrder).catch(error => 
    console.error("Erreur lors de la synchronisation de la commande:", error)
  );
  
  return newOrder;
};

// Synchroniser avec les commandes admin
const syncWithAdminOrders = (order: OrderData) => {
  // Récupérer les commandes admin existantes
  const adminOrdersStr = localStorage.getItem(ORDER_STORAGE_KEY);
  const adminOrders = adminOrdersStr ? JSON.parse(adminOrdersStr) : [];
  
  // Créer un ID unique pour la commande
  const orderId = `CMD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Convertir le format de la commande
  const adminOrder = {
    id: orderId,
    client: order.establishmentName,
    quantity: order.quantity,
    date: new Date(order.date).toISOString().split('T')[0],
    status: "pending",
    city: order.city
  };
  
  // Ajouter à la liste des commandes admin
  adminOrders.push(adminOrder);
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(adminOrders));
  console.log(`Commande synchronisée avec l'interface admin: ${orderId}`);
  
  // Recalculer les totaux
  recalculateOrderTotals();
};

// Amélioration de la fonction de synchronisation pour toutes les plateformes
export const triggerSyncEvent = () => {
  console.log("Déclenchement d'un événement de synchronisation global");
  
  // Mettre à jour le timestamp de synchronisation pour que tous les clients sachent qu'il y a eu un changement
  const timestamp = new Date().toISOString();
  localStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp);
  
  // Déclencher des événements personnalisés pour les écouteurs locaux
  window.dispatchEvent(new CustomEvent('orderUpdated'));
  window.dispatchEvent(new CustomEvent('stockUpdated'));
  window.dispatchEvent(new CustomEvent('syncEvent', { detail: { timestamp } }));
  window.dispatchEvent(new CustomEvent('forceDataRefresh'));
  
  // Forcer un événement de stockage qui sera détecté par les autres fenêtres/onglets
  localStorage.setItem('last_update', timestamp);
  
  console.log("Événement de synchronisation déclenché à", timestamp);
  
  // Utiliser Broadcast Channel API pour une communication plus robuste entre onglets et plateformes
  try {
    const channel = new BroadcastChannel('chata-sync-channel');
    channel.postMessage({ 
      type: 'sync', 
      timestamp, 
      source: 'orderService',
      data: {
        stock: getAvailableStock(),
        weeklyTotal: getWeeklyTotal(),
        monthlyTotal: getMonthlyTotal(),
        lastUpdate: timestamp
      }
    });
    
    // Garder le canal ouvert pendant un moment pour assurer la transmission
    setTimeout(() => channel.close(), 500);
  } catch (error) {
    console.warn("BroadcastChannel API non supportée:", error);
    // Fallback en continuant avec les autres méthodes de synchronisation
  }
};

// Configuration améliorée des écouteurs pour le canal de broadcast
export const setupBroadcastListeners = () => {
  try {
    const channel = new BroadcastChannel('chata-sync-channel');
    
    channel.onmessage = (event) => {
      console.log("Message reçu via BroadcastChannel:", event.data);
      
      // Traitement du message en fonction de son type
      if (event.data.type === 'sync') {
        // Si nous recevons des données complètes, les utiliser directement
        if (event.data.data) {
          if (event.data.data.stock !== undefined) {
            localStorage.setItem(STOCK_KEY, event.data.data.stock.toString());
          }
          if (event.data.data.weeklyTotal !== undefined) {
            localStorage.setItem(WEEKLY_TOTAL_KEY, event.data.data.weeklyTotal.toString());
          }
          if (event.data.data.monthlyTotal !== undefined) {
            localStorage.setItem(MONTHLY_TOTAL_KEY, event.data.data.monthlyTotal.toString());
          }
        }
        
        // Déclencher une mise à jour des données locales
        window.dispatchEvent(new CustomEvent('forceDataRefresh'));
      }
    };
    
    // Demander les dernières données au moment de la connexion
    channel.postMessage({ 
      type: 'requestUpdate', 
      timestamp: new Date().toISOString()
    });
    
    console.log("BroadcastChannel configuré avec succès");
    return channel; // Retourner le canal pour pouvoir le fermer plus tard si nécessaire
  } catch (error) {
    console.warn("BroadcastChannel API non supportée:", error);
    return null;
  }
};

// Mettre à jour les totaux des commandes quand une nouvelle commande est ajoutée
const updateOrderTotals = (quantity: number): void => {
  // Mettre à jour le total hebdomadaire
  const weeklyTotal = getWeeklyTotal();
  setWeeklyTotal(weeklyTotal + quantity);
  
  // Mettre à jour le total mensuel
  const monthlyTotal = getMonthlyTotal();
  setMonthlyTotal(monthlyTotal + quantity);
  
  console.log(`Totaux mis à jour - Hebdo: ${weeklyTotal + quantity}, Mensuel: ${monthlyTotal + quantity}`);
};

// Synchroniser une commande avec Supabase
import { supabase } from "@/lib/supabase";

export const syncOrderToSupabase = async (order: OrderData): Promise<void> => {
  try {
    // Créer un ID unique pour la commande
    const orderId = `CMD-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Préparer les données pour Supabase
    const orderData = {
      id: orderId,
      client: order.establishmentName,
      quantity: order.quantity,
      date: new Date(order.date).toISOString().split('T')[0],
      status: "pending",
      city: order.city,
      phone_number: order.phoneNumber
    };
    
    // Insérer dans Supabase
    const { error } = await supabase
      .from('orders')
      .insert([orderData]);
    
    if (error) {
      console.error("Erreur lors de l'enregistrement de la commande dans Supabase:", error);
      // Ne pas arrêter l'exécution, l'ordre est déjà enregistré localement
    } else {
      console.log(`Commande ${orderId} synchronisée avec Supabase`);
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation avec Supabase:", error);
    // Ne pas arrêter l'exécution, l'ordre est déjà enregistré localement
  }
};

// Synchroniser toutes les commandes locales avec Supabase
export const syncAllOrdersToSupabase = async (): Promise<void> => {
  try {
    const localOrders = getAllOrders();
    if (localOrders.length === 0) return;
    
    for (const order of localOrders) {
      await syncOrderToSupabase(order);
    }
    
    console.log('Toutes les commandes locales ont été synchronisées avec Supabase');
  } catch (error) {
    console.error("Erreur lors de la synchronisation des commandes:", error);
  }
};

// Obtenir la quantité totale pour la semaine
export const getWeeklyTotal = (): number => {
  // En mode production (site publié), vérifier si des données ont été modifiées par l'admin
  if (import.meta.env.PROD) {
    const storedTotal = localStorage.getItem(WEEKLY_TOTAL_KEY);
    // Si des données ont été modifiées par l'admin, utiliser celles-ci
    if (storedTotal) {
      return parseInt(storedTotal, 10);
    }
    // Sinon utiliser la valeur par défaut
    return DEFAULT_WEEKLY_TOTAL;
  }
  
  // Mode développement - logique existante
  const storedTotal = localStorage.getItem(WEEKLY_TOTAL_KEY);
  if (storedTotal) {
    return parseInt(storedTotal, 10);
  }
  
  // Calcul basé sur les commandes si aucune valeur n'est stockée
  const orders = getAllOrders();
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const total = orders
    .filter(order => new Date(order.date) >= startOfWeek)
    .reduce((total, order) => total + order.quantity, 0);
  
  // Stocker pour utilisation future
  localStorage.setItem(WEEKLY_TOTAL_KEY, total.toString());
  
  console.log(`Weekly total calculé: ${total}`);
  return total;
};

// Obtenir la quantité totale pour le mois
export const getMonthlyTotal = (): number => {
  // En mode production (site publié), vérifier si des données ont été modifiées par l'admin
  if (import.meta.env.PROD) {
    const storedTotal = localStorage.getItem(MONTHLY_TOTAL_KEY);
    // Si des données ont été modifiées par l'admin, utiliser celles-ci
    if (storedTotal) {
      return parseInt(storedTotal, 10);
    }
    // Sinon utiliser la valeur par défaut
    return DEFAULT_MONTHLY_TOTAL;
  }
  
  // Mode développement - logique existante
  const storedTotal = localStorage.getItem(MONTHLY_TOTAL_KEY);
  if (storedTotal) {
    return parseInt(storedTotal, 10);
  }
  
  // Calcul basé sur les commandes si aucune valeur n'est stockée
  const orders = getAllOrders();
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const total = orders
    .filter(order => new Date(order.date) >= startOfMonth)
    .reduce((total, order) => total + order.quantity, 0);
  
  // Stocker pour utilisation future
  localStorage.setItem(MONTHLY_TOTAL_KEY, total.toString());
  
  console.log(`Monthly total calculé: ${total}`);
  return total;
};

// Définir la quantité totale pour la semaine
export const setWeeklyTotal = (total: number): void => {
  localStorage.setItem(WEEKLY_TOTAL_KEY, total.toString());
  // Déclencher des événements pour informer toutes les fenêtres/onglets
  triggerSyncEvent();
  console.log(`Weekly total mis à jour: ${total}`);
};

// Définir la quantité totale pour le mois
export const setMonthlyTotal = (total: number): void => {
  localStorage.setItem(MONTHLY_TOTAL_KEY, total.toString());
  // Déclencher des événements pour informer toutes les fenêtres/onglets
  triggerSyncEvent();
  console.log(`Monthly total mis à jour: ${total}`);
};

// Obtenir le stock disponible
export const getAvailableStock = (): number => {
  // En mode production (site publié), vérifier si des données ont été modifiées par l'admin
  if (import.meta.env.PROD) {
    const stock = localStorage.getItem(STOCK_KEY);
    // Si des données ont été modifiées par l'admin, utiliser celles-ci
    if (stock) {
      return parseInt(stock, 10);
    }
    // Sinon utiliser la valeur par défaut
    return DEFAULT_AVAILABLE_STOCK;
  }
  
  // Mode développement - logique existante
  const stock = localStorage.getItem(STOCK_KEY);
  return stock ? parseInt(stock, 10) : DEFAULT_AVAILABLE_STOCK;
};

// Obtenir la date de dernière mise à jour du stock
export const getStockLastUpdate = (): Date | null => {
  const lastUpdate = localStorage.getItem(STOCK_LAST_UPDATE_KEY);
  return lastUpdate ? new Date(lastUpdate) : null;
};

// Définir le stock disponible avec synchronisation améliorée
export const setAvailableStock = (stock: number): void => {
  // Sauvegarder l'ancien stock pour historique/comparaison
  const oldStock = getAvailableStock();
  
  // Définir le nouveau stock
  localStorage.setItem(STOCK_KEY, stock.toString());
  
  // Mettre à jour la date de dernière modification
  const timestamp = new Date().toISOString();
  localStorage.setItem(STOCK_LAST_UPDATE_KEY, timestamp);
  
  // Déclencher des événements pour informer toutes les fenêtres/onglets
  triggerSyncEvent();
  
  // Notifier directement via BroadcastChannel pour une mise à jour plus rapide
  try {
    const channel = new BroadcastChannel('chata-sync-channel');
    channel.postMessage({
      type: 'stockUpdate',
      timestamp,
      oldValue: oldStock,
      newValue: stock
    });
    setTimeout(() => channel.close(), 100);
  } catch (error) {
    console.warn("BroadcastChannel API non supportée pour la mise à jour du stock:", error);
  }
  
  console.log(`Stock mis à jour: ${oldStock} -> ${stock} tonnes à ${timestamp}`);
};

// Fonction spécifique pour réinitialiser les compteurs en cas de besoin
export const resetOrderCounters = (): void => {
  localStorage.setItem(WEEKLY_TOTAL_KEY, "0");
  localStorage.setItem(MONTHLY_TOTAL_KEY, "0");
  
  // Déclencher des événements pour informer toutes les fenêtres/onglets
  triggerSyncEvent();
  
  console.log("Compteurs de commandes réinitialisés");
};

// Recalculer les totaux en fonction des commandes existantes
export const recalculateOrderTotals = (): void => {
  // Récupérer les ordres depuis le stockage admin
  const adminOrdersStr = localStorage.getItem(ORDER_STORAGE_KEY);
  if (!adminOrdersStr) {
    console.log("Pas de commandes administrateur trouvées");
    return;
  }
  
  const adminOrders = JSON.parse(adminOrdersStr);
  const today = new Date();
  
  // Calculer le total hebdomadaire (commandes de cette semaine)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const weeklyTotal = adminOrders
    .filter(order => new Date(order.date) >= startOfWeek)
    .reduce((total, order) => total + order.quantity, 0);
  
  // Calculer le total mensuel (commandes de ce mois)
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const monthlyTotal = adminOrders
    .filter(order => new Date(order.date) >= startOfMonth)
    .reduce((total, order) => total + order.quantity, 0);
  
  // Mettre à jour les totaux dans localStorage
  setWeeklyTotal(weeklyTotal);
  setMonthlyTotal(monthlyTotal);
  
  console.log(`Totaux recalculés - Hebdo: ${weeklyTotal}, Mensuel: ${monthlyTotal}`);
};

// Nouvelle fonction pour forcer une synchronisation complète sur toutes les plateformes
export const forceSyncAllPlatforms = async (): Promise<void> => {
  try {
    // Recalculer les totaux
    recalculateOrderTotals();
    
    // Synchroniser avec Supabase si disponible
    await syncAllOrdersToSupabase();
    
    // Déclencher un événement de synchronisation
    triggerSyncEvent();
    
    // Utiliser le Service Worker si disponible pour une synchronisation encore plus large
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'FORCE_SYNC',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log("Synchronisation forcée sur toutes les plateformes terminée");
    return true;
  } catch (error) {
    console.error("Erreur lors de la synchronisation forcée:", error);
    return false;
  }
};
