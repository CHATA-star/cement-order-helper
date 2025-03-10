
interface OrderData {
  establishmentName: string;
  quantity: number;
  phoneNumber: string;
  date: Date;
}

// Stocker les commandes dans le localStorage
const ORDERS_KEY = 'cement_orders';

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
  const orders = getAllOrders();
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  return orders
    .filter(order => new Date(order.date) >= startOfWeek)
    .reduce((total, order) => total + order.quantity, 0);
};

// Obtenir la quantité totale pour le mois
export const getMonthlyTotal = (): number => {
  const orders = getAllOrders();
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return orders
    .filter(order => new Date(order.date) >= startOfMonth)
    .reduce((total, order) => total + order.quantity, 0);
};
