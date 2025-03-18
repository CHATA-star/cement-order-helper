
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Order, mockOrders } from "@/types/order";
import OrderSearch from "./orders/OrderSearch";
import OrdersTable from "./orders/OrdersTable";

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateOrderStatus = (id: string, newStatus: "completed" | "pending" | "cancelled") => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    
    setEditingOrderId(null);
    
    // Afficher une notification
    toast({
      title: "Statut modifié",
      description: `La commande ${id} a été mise à jour avec succès.`
    });
  };

  const toggleEditStatus = (id: string) => {
    setEditingOrderId(editingOrderId === id ? null : id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Gestion des commandes</CardTitle>
          <Button size="sm" className="bg-cement-600 hover:bg-cement-700">
            <FileText className="mr-2 h-4 w-4" />
            Exporter les commandes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <OrderSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <OrdersTable 
          orders={filteredOrders} 
          editingOrderId={editingOrderId}
          toggleEditStatus={toggleEditStatus}
          updateOrderStatus={updateOrderStatus}
        />
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
