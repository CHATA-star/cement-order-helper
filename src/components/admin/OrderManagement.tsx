
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Save, Upload } from "lucide-react";
import OrdersTable from "./orders/OrdersTable";
import OrderSearch from "./orders/OrderSearch";
import { Order, mockOrders } from "@/types/order";
import { useToast } from "@/hooks/use-toast";
import { triggerSyncEvent, recalculateOrderTotals } from "@/services/orderService";
import { useIsMobile } from "@/hooks/use-mobile";

const ORDER_STORAGE_KEY = "admin_orders";

const OrderManagement = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [showStoragePanel, setShowStoragePanel] = useState(false);

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
    
    // Recalculate totals
    recalculateOrderTotals();
    
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
    
    // Recalculate totals after deletion
    recalculateOrderTotals();
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
    
    // Recalculate totals after addition
    recalculateOrderTotals();
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

  // Nouvelle fonction pour sauvegarder les commandes actuelles dans un stockage permanent
  const saveOrdersToStorage = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const storageKey = `orders_backup_${timestamp}`;
    
    // Sauvegarder les commandes avec une clé datée
    localStorage.setItem(storageKey, JSON.stringify(orders));
    
    toast({
      title: "Sauvegarde réussie",
      description: `${orders.length} commandes sauvegardées avec l'identifiant: ${timestamp}`
    });
  };

  // Fonction pour afficher les sauvegardes disponibles
  const toggleStoragePanel = () => {
    setShowStoragePanel(!showStoragePanel);
  };

  // Récupérer la liste des sauvegardes disponibles
  const getStorageBackups = () => {
    const backups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('orders_backup_')) {
        const date = key.replace('orders_backup_', '');
        const count = JSON.parse(localStorage.getItem(key) || '[]').length;
        backups.push({ date, count, key });
      }
    }
    return backups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Charger une sauvegarde spécifique
  const loadBackup = (key: string) => {
    const backup = localStorage.getItem(key);
    if (backup) {
      const backupOrders = JSON.parse(backup);
      setOrders(backupOrders);
      localStorage.setItem(ORDER_STORAGE_KEY, backup);
      
      // Trigger sync event to update all components
      triggerSyncEvent();
      
      // Recalculate totals after loading backup
      recalculateOrderTotals();
      
      toast({
        title: "Sauvegarde chargée",
        description: `${backupOrders.length} commandes restaurées depuis la sauvegarde du ${key.replace('orders_backup_', '')}`
      });
    }
  };

  // Supprimer une sauvegarde spécifique
  const deleteBackup = (key: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette sauvegarde du ${key.replace('orders_backup_', '')} ?`)) {
      localStorage.removeItem(key);
      toast({
        title: "Sauvegarde supprimée",
        description: `La sauvegarde du ${key.replace('orders_backup_', '')} a été supprimée`
      });
      // Forcer la mise à jour de l'interface
      setShowStoragePanel(false);
      setTimeout(() => setShowStoragePanel(true), 10);
    }
  };

  return (
    <Card>
      <CardHeader className={`${isMobile ? "p-3 pb-0" : ""} flex flex-col gap-2`}>
        <div>
          <CardTitle className={isMobile ? "text-lg" : ""}>Gestion des commandes</CardTitle>
          <CardDescription>Gérez l'ensemble des commandes de vos clients</CardDescription>
        </div>
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} ${isMobile ? "space-y-2" : "space-x-2"} mt-2`}>
          <Button variant="outline" className="w-full md:w-auto" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" className="w-full md:w-auto" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
          <Button variant="outline" className="w-full md:w-auto" onClick={saveOrdersToStorage}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline" className="w-full md:w-auto" onClick={toggleStoragePanel}>
            <Upload className="h-4 w-4 mr-2" />
            Historique
          </Button>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "p-3" : ""}>
        {showStoragePanel && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-medium mb-3">Historique des sauvegardes</h3>
            {getStorageBackups().length === 0 ? (
              <p className="text-gray-500">Aucune sauvegarde disponible</p>
            ) : (
              <div className="space-y-2">
                {getStorageBackups().map((backup) => (
                  <div key={backup.key} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <span className="font-medium">{backup.date}</span>
                      <span className="text-sm text-gray-500 ml-2">({backup.count} commandes)</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => loadBackup(backup.key)}>
                        Charger
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteBackup(backup.key)}>
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
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
