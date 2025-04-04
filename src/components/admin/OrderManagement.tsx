
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import OrdersTable from "./orders/OrdersTable";
import OrderSearch from "./orders/OrderSearch";
import { Order, mockOrders } from "@/types/order";
import { useToast } from "@/hooks/use-toast";
import { triggerSyncEvent } from "@/services/orderService";

const ORDER_STORAGE_KEY = "admin_orders";

const OrderManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    
    // Add event listener for order updates
    window.addEventListener('orderUpdated', loadOrders);
    window.addEventListener('syncEvent', loadOrders);
    window.addEventListener('forceDataRefresh', loadOrders);
    
    return () => {
      window.removeEventListener('orderUpdated', loadOrders);
      window.removeEventListener('syncEvent', loadOrders);
      window.removeEventListener('forceDataRefresh', loadOrders);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(
        order =>
          order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchTerm, orders]);

  const loadOrders = () => {
    const storedOrders = localStorage.getItem(ORDER_STORAGE_KEY);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Use mock data if no stored orders
      setOrders(mockOrders);
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(mockOrders));
    }
  };
  
  const handleRefresh = () => {
    loadOrders();
    toast({
      title: "Données actualisées",
      description: "La liste des commandes a été mise à jour"
    });
  };

  const toggleEditStatus = (id: string) => {
    setEditingOrderId(editingOrderId === id ? null : id);
  };

  const updateOrderStatus = (id: string, status: "completed" | "pending" | "cancelled") => {
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status } : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
    setEditingOrderId(null);
    
    // Trigger sync event to update all components
    triggerSyncEvent();
    
    toast({
      title: "Statut mis à jour",
      description: `La commande ${id} a été mise à jour avec succès`,
    });
  };
  
  const deleteOrder = (id: string) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
    
    // Trigger sync event to update all components
    triggerSyncEvent();
  };
  
  const addOrder = (orderData: Omit<Order, "id">) => {
    // Generate a unique ID for the new order
    const orderId = `CMD-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newOrder: Order = {
      id: orderId,
      ...orderData
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
    
    // Trigger sync event to update all components
    triggerSyncEvent();
  };

  const exportToCSV = () => {
    // Convert orders to CSV string
    const headers = ["ID", "Client", "Ville", "Quantité", "Date", "Statut"];
    const ordersData = orders.map(order => [
      order.id,
      order.client,
      order.city,
      order.quantity,
      new Date(order.date).toLocaleDateString(),
      order.status === "completed" ? "Livré" : 
        order.status === "pending" ? "En attente" : "Annulé"
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...ordersData.map(row => row.join(","))
    ].join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `commandes_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Les données ont été exportées au format CSV avec succès.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestion des commandes</CardTitle>
          <CardDescription>Gérez l'ensemble des commandes de vos clients</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <OrderSearch onSearch={setSearchTerm} />
          <OrdersTable
            orders={filteredOrders}
            editingOrderId={editingOrderId}
            toggleEditStatus={toggleEditStatus}
            updateOrderStatus={updateOrderStatus}
            deleteOrder={deleteOrder}
            addOrder={addOrder}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
