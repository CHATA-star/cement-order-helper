
export interface Order {
  id: string;
  client: string;
  quantity: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
  city: string;
}

// Mock data for orders
export const mockOrders: Order[] = [
  { 
    id: "CMD-001", 
    client: "Bâtiments ModernesCO", 
    quantity: 250, 
    date: "2023-09-15", 
    status: "completed", 
    city: "Dakar"
  },
  { 
    id: "CMD-002", 
    client: "Construction Rapide SARL", 
    quantity: 500, 
    date: "2023-09-18", 
    status: "pending", 
    city: "Thiès"
  },
  { 
    id: "CMD-003", 
    client: "EcoHabitat Inc", 
    quantity: 150, 
    date: "2023-09-20", 
    status: "cancelled", 
    city: "Saint-Louis"
  },
  { 
    id: "CMD-004", 
    client: "Immobilier Premium", 
    quantity: 1000, 
    date: "2023-09-22", 
    status: "pending", 
    city: "Mbour"
  },
];
