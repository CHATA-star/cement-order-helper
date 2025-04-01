
interface OrderData {
  establishmentName: string;
  quantity: number;
  phoneNumber: string;
  city: string;
  date: Date;
}

// Clés de stockage localStorage
const ORDERS_KEY = 'cement_orders';
const WEEKLY_TOTAL_KEY = 'weekly_total';
const MONTHLY_TOTAL_KEY = 'monthly_total';
const STOCK_KEY = 'available_stock';
const STOCK_LAST_UPDATE_KEY = 'stock_last_update';
const SYNC_TIMESTAMP_KEY = 'sync_timestamp';

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
  
  // Synchroniser avec Supabase (sans attendre la réponse pour ne pas bloquer l'UI)
  syncOrderToSupabase(newOrder).catch(error => 
    console.error("Erreur lors de la synchronisation de la commande:", error)
  );
  
  return newOrder;
};

// Déclencher un événement de synchronisation pour tous les clients
export const triggerSyncEvent = () => {
  console.log("Déclenchement d'un événement de synchronisation global");
  
  // Mettre à jour le timestamp de synchronisation pour que tous les clients sachent qu'il y a eu un changement
  const timestamp = new Date().toISOString();
  localStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp);
  
  // Déclencher des événements personnalisés pour les écouteurs locaux
  window.dispatchEvent(new CustomEvent('orderUpdated'));
  window.dispatchEvent(new CustomEvent('stockUpdated'));
  window.dispatchEvent(new CustomEvent('syncEvent', { detail: { timestamp } }));
  
  // Forcer un événement de stockage qui sera détecté par les autres fenêtres/onglets
  localStorage.setItem('last_update', timestamp);
  
  console.log("Événement de synchronisation déclenché à", timestamp);
  
  // On peut également utiliser Broadcast Channel API pour une communication plus robuste entre onglets
  try {
    const channel = new BroadcastChannel('chata-sync-channel');
    channel.postMessage({ 
      type: 'sync', 
      timestamp, 
      source: 'orderService'
    });
    // Fermer le canal après l'envoi pour libérer les ressources
    setTimeout(() => channel.close(), 100);
  } catch (error) {
    console.warn("BroadcastChannel API non supportée:", error);
    // Fallback en continuant avec les autres méthodes de synchronisation
  }
};

// Configuration des écouteurs pour le canal de broadcast
export const setupBroadcastListeners = () => {
  try {
    const channel = new BroadcastChannel('chata-sync-channel');
    channel.onmessage = (event) => {
      console.log("Message reçu via BroadcastChannel:", event.data);
      if (event.data.type === 'sync') {
        // Déclencher une mise à jour des données locales
        window.dispatchEvent(new CustomEvent('forceDataRefresh'));
      }
    };
    // Garder la référence du canal pour pouvoir le fermer plus tard
    // Cette ligne est pour l'exemple; dans une véritable implémentation,
    // il faudrait la stocker dans une variable accessible pour le nettoyage
    console.log("BroadcastChannel configuré avec succès");
  } catch (error) {
    console.warn("BroadcastChannel API non supportée:", error);
  }
};

// Appeler cette fonction au démarrage de l'application (par exemple dans le useEffect de App.js)
setupBroadcastListeners();

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
  const stock = localStorage.getItem(STOCK_KEY);
  return stock ? parseInt(stock, 10) : 2000; // Valeur par défaut de 2000 tonnes
};

// Obtenir la date de dernière mise à jour du stock
export const getStockLastUpdate = (): Date | null => {
  const lastUpdate = localStorage.getItem(STOCK_LAST_UPDATE_KEY);
  return lastUpdate ? new Date(lastUpdate) : null;
};

// Définir le stock disponible
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
  
  console.log(`Stock mis à jour: ${oldStock} -> ${stock} tonnes à ${timestamp}`);
};

// Fonction spécifique pour réinitialiser les compteurs en cas de besoin
export const resetOrderCounters = (): void => {
  const weeklyTotal = getWeeklyTotal();
  const monthlyTotal = getMonthlyTotal();
  
  console.log(`Réinitialisation des compteurs - Hebdomadaire: ${weeklyTotal}, Mensuel: ${monthlyTotal}`);
  
  localStorage.setItem(WEEKLY_TOTAL_KEY, "0");
  localStorage.setItem(MONTHLY_TOTAL_KEY, "0");
  
  // Déclencher des événements pour informer toutes les fenêtres/onglets
  triggerSyncEvent();
};
