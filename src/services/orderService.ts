import { v4 as uuidv4 } from 'uuid';

// Définition des types
export interface Order {
  id: string;
  establishmentName: string;
  quantity: number;
  deliveryCity: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  contactNumber: string;
  additionalNotes: string;
  deliveryAddress: string;
}

// Fonctions d'aide pour localStorage
const getOrdersFromLocalStorage = (): Order[] => {
  try {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Error retrieving orders from localStorage:", error);
    return [];
  }
};

const saveOrdersToLocalStorage = (orders: Order[]): void => {
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('orderUpdated'));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
};

const getAvailableStockFromLocalStorage = (): number => {
  try {
    const stock = localStorage.getItem('availableStock');
    return stock ? parseInt(stock, 10) : 500; // Valeur par défaut
  } catch (error) {
    console.error("Error retrieving availableStock from localStorage:", error);
    return 500;
  }
};

const saveAvailableStockToLocalStorage = (stock: number): void => {
  try {
    localStorage.setItem('availableStock', stock.toString());
    window.dispatchEvent(new Event('stockUpdated'));
  } catch (error) {
    console.error("Error saving availableStock to localStorage:", error);
  }
};

const getWeeklyTotalFromLocalStorage = (): number => {
  try {
    const weeklyTotal = localStorage.getItem('weeklyTotal');
    return weeklyTotal ? parseInt(weeklyTotal, 10) : 0;
  } catch (error) {
    console.error("Error retrieving weeklyTotal from localStorage:", error);
    return 0;
  }
};

const saveWeeklyTotalToLocalStorage = (total: number): void => {
  try {
    localStorage.setItem('weeklyTotal', total.toString());
  } catch (error) {
    console.error("Error saving weeklyTotal to localStorage:", error);
  }
};

const getMonthlyTotalFromLocalStorage = (): number => {
  try {
    const monthlyTotal = localStorage.getItem('monthlyTotal');
    return monthlyTotal ? parseInt(monthlyTotal, 10) : 0;
  } catch (error) {
    console.error("Error retrieving monthlyTotal from localStorage:", error);
    return 0;
  }
};

const saveMonthlyTotalToLocalStorage = (total: number): void => {
  try {
    localStorage.setItem('monthlyTotal', total.toString());
  } catch (error) {
    console.error("Error saving monthlyTotal to localStorage:", error);
  }
};

// Fonctions de gestion des commandes
export const createOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Order => {
  const newOrder: Order = {
    id: uuidv4(),
    orderDate: new Date().toISOString(),
    status: 'pending',
    ...orderData,
  };
  const orders = getOrdersFromLocalStorage();
  saveOrdersToLocalStorage([...orders, newOrder]);
  return newOrder;
};

export const getOrders = (): Order[] => {
  return getOrdersFromLocalStorage();
};

export const updateOrder = (id: string, updates: Partial<Order>): Order | undefined => {
  const orders = getOrdersFromLocalStorage();
  const updatedOrders = orders.map(order => order.id === id ? { ...order, ...updates } : order);
  saveOrdersToLocalStorage(updatedOrders);
  return updatedOrders.find(order => order.id === id);
};

export const deleteOrder = (id: string): void => {
  const orders = getOrdersFromLocalStorage();
  const updatedOrders = orders.filter(order => order.id !== id);
  saveOrdersToLocalStorage(updatedOrders);
};

// Fonctions de gestion du stock
export const getAvailableStock = (): number => {
  return getAvailableStockFromLocalStorage();
};

export const setAvailableStock = (newStock: number): void => {
  saveAvailableStockToLocalStorage(newStock);
};

// Fonctions de gestion des totaux hebdomadaires et mensuels
export const getWeeklyTotal = (): number => {
  return getWeeklyTotalFromLocalStorage();
};

export const setWeeklyTotal = (total: number): void => {
  saveWeeklyTotalToLocalStorage(total);
};

export const getMonthlyTotal = (): number => {
  return getMonthlyTotalFromLocalStorage();
};

export const setMonthlyTotal = (total: number): void => {
  saveMonthlyTotalToLocalStorage(total);
};

/**
 * Configure les écouteurs pour la communication entre les onglets et les plateformes.
 */
export function setupBroadcastListeners(): BroadcastChannel | null {
  // Utiliser BroadcastChannel pour la communication entre les fenêtres et les applications PWA
  let syncChannel: BroadcastChannel | null = null;
  
  try {
    syncChannel = new BroadcastChannel('chataciment_sync');
    
    syncChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'FORCE_SYNC') {
        console.log('Received force sync event from another platform');
        window.dispatchEvent(new CustomEvent('forceDataRefresh'));
      }
    };
    
    console.log('BroadcastChannel listener setup successfully');
  } catch (error) {
    console.warn('BroadcastChannel not supported or error:', error);
  }
  
  return syncChannel;
}

/**
 * Déclenche un événement de synchronisation sur toutes les plateformes
 */
export function triggerSyncEvent(): void {
  // Déclencher un événement personnalisé pour les mises à jour
  window.dispatchEvent(new CustomEvent('syncEvent'));
  
  // Utiliser le stockage local pour la communication entre onglets
  try {
    localStorage.setItem('sync_timestamp', new Date().toISOString());
    console.log('Synchronization event triggered across platforms');
    return; // Make sure to return void here
  } catch (error) {
    console.error('Error triggering sync event:', error);
    return; // Make sure to return void here
  }
}

/**
 * Force la synchronisation sur toutes les plateformes connectées
 */
export function forceSyncAllPlatforms(): void {
  // Synchroniser via localStorage pour les onglets
  localStorage.setItem('force_sync_timestamp', new Date().toISOString());
  
  // Utiliser BroadcastChannel pour les fenêtres et les applications PWA
  try {
    const syncChannel = new BroadcastChannel('chataciment_sync');
    syncChannel.postMessage({
      type: 'FORCE_SYNC',
      timestamp: new Date().toISOString()
    });
    syncChannel.close();
    console.log('Force sync sent to all connected platforms');
    return; // Make sure to return void here
  } catch (error) {
    console.warn('BroadcastChannel not supported or error:', error);
    return; // Make sure to return void here
  }
}
