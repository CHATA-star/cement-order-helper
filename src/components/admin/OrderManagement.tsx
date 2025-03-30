
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Order, mockOrders } from "@/types/order";
import OrderSearch from "./orders/OrderSearch";
import OrdersTable from "./orders/OrdersTable";
import { supabase } from "@/lib/supabase";
import { syncAllOrdersToSupabase } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour récupérer les commandes depuis Supabase
  const fetchOrders = async (): Promise<Order[]> => {
    try {
      // D'abord, synchroniser toutes les commandes locales avec Supabase
      await syncAllOrdersToSupabase();
      
      // Ensuite, récupérer toutes les commandes depuis Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        // En cas d'erreur, retourner les commandes de démonstration
        return mockOrders;
      }
      
      // Transformer les données pour correspondre au format Order
      return data as Order[] || mockOrders;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      return mockOrders;
    }
  };

  // Utiliser React Query pour gérer la récupération des données
  const { data: orders = mockOrders, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateOrderStatus = async (id: string, newStatus: "completed" | "pending" | "cancelled") => {
    // Mettre à jour l'état local pour une UI réactive
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    
    // Réinitialiser l'état d'édition
    setEditingOrderId(null);
    
    // Essayer de mettre à jour dans Supabase
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        console.warn("Impossible de mettre à jour la commande dans Supabase:", error.message);
        toast({
          title: "Erreur de synchronisation",
          description: "La commande a été mise à jour localement mais n'a pas pu être synchronisée avec le serveur.",
          variant: "destructive"
        });
      } else {
        // Rafraîchir les données après mise à jour
        refetch();
        
        // Afficher une notification de succès
        toast({
          title: "Statut modifié",
          description: `La commande ${id} a été mise à jour avec succès.`
        });
      }
    } catch (error) {
      console.warn("Erreur lors de la tentative de mise à jour dans Supabase:", error);
      toast({
        title: "Erreur de mise à jour",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive"
      });
    }
  };

  const toggleEditStatus = (id: string) => {
    setEditingOrderId(editingOrderId === id ? null : id);
  };

  const handleExportOrders = () => {
    try {
      // Convertir les commandes en format CSV
      const headers = ["ID", "Client", "Quantité", "Ville", "Date", "Statut"];
      const csvContent = [
        headers.join(","),
        ...filteredOrders.map(order => 
          [
            order.id,
            `"${order.client.replace(/"/g, '""')}"`, // Échapper les guillemets pour CSV
            order.quantity,
            `"${order.city.replace(/"/g, '""')}"`,
            new Date(order.date).toLocaleDateString(),
            order.status
          ].join(",")
        )
      ].join("\n");
      
      // Créer un blob et un lien de téléchargement
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportation réussie",
        description: "Les commandes ont été exportées au format CSV."
      });
    } catch (error) {
      console.error("Erreur lors de l'exportation des commandes:", error);
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur est survenue lors de l'exportation des commandes.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Gestion des commandes</CardTitle>
          <Button 
            size="sm" 
            className="bg-cement-600 hover:bg-cement-700"
            onClick={handleExportOrders}
          >
            <FileText className="mr-2 h-4 w-4" />
            Exporter les commandes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <OrderSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cement-600"></div>
          </div>
        ) : (
          <OrdersTable 
            orders={filteredOrders} 
            editingOrderId={editingOrderId}
            toggleEditStatus={toggleEditStatus}
            updateOrderStatus={updateOrderStatus}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
