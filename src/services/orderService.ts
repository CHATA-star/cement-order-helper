
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
  return newOrder;
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
  
  return total;
};

// Définir la quantité totale pour la semaine
export const setWeeklyTotal = (total: number): void => {
  localStorage.setItem(WEEKLY_TOTAL_KEY, total.toString());
};

// Définir la quantité totale pour le mois
export const setMonthlyTotal = (total: number): void => {
  localStorage.setItem(MONTHLY_TOTAL_KEY, total.toString());
};

// Obtenir le stock disponible
export const getAvailableStock = (): number => {
  const stock = localStorage.getItem(STOCK_KEY);
  return stock ? parseInt(stock, 10) : 2000; // Valeur par défaut de 2000 tonnes
};

// Définir le stock disponible
export const setAvailableStock = (stock: number): void => {
  localStorage.setItem(STOCK_KEY, stock.toString());
};
