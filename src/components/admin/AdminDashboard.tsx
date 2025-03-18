
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderStats from "@/components/dashboard/OrderStats";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Package, Settings, TrendingUp, Archive } from "lucide-react";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement";
import { getAvailableStock, setAvailableStock } from "@/services/orderService";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [availableStock, setAvailableStockState] = useState<string>("");

  useEffect(() => {
    // Get current stock
    const currentStock = getAvailableStock();
    setAvailableStockState(currentStock.toString());
  }, []);

  const handleStockUpdate = () => {
    if (availableStock && !isNaN(Number(availableStock))) {
      setAvailableStock(Number(availableStock));
      toast({
        title: "Stock mis à jour",
        description: `Le stock disponible a été mis à jour à ${availableStock} tonnes.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur numérique valide pour le stock.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Commandes</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tableau de bord CHATA CIMENT</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cement-600 mb-4">
                Bienvenue dans l'interface d'administration de CHATA CIMENT. Vous pouvez gérer les commandes, 
                les utilisateurs et configurer les paramètres du site.
              </p>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Archive className="h-5 w-5 text-cement-600" />
                    Gestion du stock
                  </h3>
                  <div className="bg-white p-4 rounded-md border border-cement-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">Stock disponible (tonnes)</label>
                        <Input 
                          type="number" 
                          placeholder="Entrez le stock disponible" 
                          value={availableStock}
                          onChange={(e) => setAvailableStockState(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="bg-cement-600 hover:bg-cement-700 self-end" 
                        onClick={handleStockUpdate}
                      >
                        Mettre à jour
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Statistiques des commandes</h3>
                  <OrderStats isAdmin={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-2">Informations de l'entreprise</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nom de l'entreprise</label>
                      <Input defaultValue="CHATA CIMENT" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Contact WhatsApp</label>
                      <Input defaultValue="0161080251" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email de contact</label>
                      <Input defaultValue="nabiletamou@gmail.com" />
                    </div>
                  </div>
                  <Button className="mt-4 bg-cement-600 hover:bg-cement-700" onClick={() => {
                    toast({
                      title: "Paramètres sauvegardés",
                      description: "Les modifications ont été enregistrées avec succès."
                    });
                  }}>
                    Sauvegarder les modifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
