
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Package, Settings, TrendingUp, Edit2, LogOut, RefreshCw } from "lucide-react";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  getAvailableStock, 
  setAvailableStock, 
  getWeeklyTotal, 
  setWeeklyTotal, 
  getMonthlyTotal, 
  setMonthlyTotal,
  triggerSyncEvent
} from "@/services/orderService";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [availableStock, setAvailableStockState] = useState<string>("");
  const [weeklyTotal, setWeeklyTotalState] = useState<string>("");
  const [monthlyTotal, setMonthlyTotalState] = useState<string>("");
  const [isEditingWeekly, setIsEditingWeekly] = useState(false);
  const [isEditingMonthly, setIsEditingMonthly] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Fonction pour charger manuellement les valeurs
  const loadValues = () => {
    const currentStock = getAvailableStock();
    const currentWeekly = getWeeklyTotal();
    const currentMonthly = getMonthlyTotal();
    
    setAvailableStockState(currentStock.toString());
    setWeeklyTotalState(currentWeekly.toString());
    setMonthlyTotalState(currentMonthly.toString());
    setLastUpdateTime(new Date());
    
    console.log("AdminDashboard: Values loaded manually", { 
      stock: currentStock, 
      weekly: currentWeekly, 
      monthly: currentMonthly,
      time: new Date().toISOString()
    });
  };

  useEffect(() => {
    // Charger les valeurs initiales
    loadValues();
    
    // Écouter les événements pour les mises à jour manuelles
    window.addEventListener('storage', loadValues);
    window.addEventListener('orderUpdated', loadValues);
    window.addEventListener('stockUpdated', loadValues);
    window.addEventListener('syncEvent', loadValues);
    window.addEventListener('forceDataRefresh', loadValues);
    
    // Supprimer l'intervalle de rafraîchissement automatique
    
    return () => {
      window.removeEventListener('storage', loadValues);
      window.removeEventListener('orderUpdated', loadValues);
      window.removeEventListener('stockUpdated', loadValues);
      window.removeEventListener('syncEvent', loadValues);
      window.removeEventListener('forceDataRefresh', loadValues);
    };
  }, []);

  const handleStockUpdate = () => {
    if (availableStock && !isNaN(Number(availableStock))) {
      setAvailableStock(Number(availableStock));
      
      // Déclencher un événement de synchronisation pour toutes les fenêtres/onglets
      triggerSyncEvent();
      
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

  const handleWeeklyUpdate = () => {
    if (weeklyTotal && !isNaN(Number(weeklyTotal))) {
      setWeeklyTotal(Number(weeklyTotal));
      setIsEditingWeekly(false);
      
      // Déclencher un événement de synchronisation pour toutes les fenêtres/onglets
      triggerSyncEvent();
      
      toast({
        title: "Total hebdomadaire mis à jour",
        description: `Le total des commandes hebdomadaires a été mis à jour à ${weeklyTotal} tonnes.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur numérique valide.",
        variant: "destructive"
      });
    }
  };

  const handleMonthlyUpdate = () => {
    if (monthlyTotal && !isNaN(Number(monthlyTotal))) {
      setMonthlyTotal(Number(monthlyTotal));
      setIsEditingMonthly(false);
      
      // Déclencher un événement de synchronisation pour toutes les fenêtres/onglets
      triggerSyncEvent();
      
      toast({
        title: "Total mensuel mis à jour",
        description: `Le total des commandes mensuelles a été mis à jour à ${monthlyTotal} tonnes.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur numérique valide.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cement-800">Tableau de bord administrateur</h2>
        <Button variant="outline" className="flex items-center gap-2" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
      
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
                  <h3 className="text-lg font-medium mb-4">Statistiques des commandes</h3>
                  
                  <div className="flex justify-end mb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={loadValues}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Rafraîchir les données
                    </Button>
                  </div>
                  
                  <div className={`grid grid-cols-1 ${isMobile ? "" : "md:grid-cols-3"} gap-4 mb-8`}>
                    {/* Commandes de la semaine */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Commandes de la semaine</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setIsEditingWeekly(!isEditingWeekly)}
                        >
                          <Edit2 className="h-4 w-4 text-cement-500" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {isEditingWeekly ? (
                          <div className="flex flex-col gap-2">
                            <Input 
                              type="number" 
                              placeholder="Entrez le total hebdomadaire" 
                              value={weeklyTotal}
                              onChange={(e) => setWeeklyTotalState(e.target.value)}
                              className="text-md font-medium"
                            />
                            <Button 
                              className="bg-cement-600 hover:bg-cement-700 w-full" 
                              onClick={handleWeeklyUpdate}
                              size="sm"
                            >
                              Mettre à jour
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="text-2xl font-bold">{Number(weeklyTotal)} tonnes</div>
                            <p className="text-xs text-muted-foreground">Total des commandes cette semaine</p>
                          </>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Stock disponible actuellement */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Stock disponible</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <Input 
                            type="number" 
                            placeholder="Entrez le stock disponible" 
                            value={availableStock}
                            onChange={(e) => setAvailableStockState(e.target.value)}
                            className="text-md font-medium"
                          />
                          <Button 
                            className="bg-cement-600 hover:bg-cement-700 w-full" 
                            onClick={handleStockUpdate}
                            size="sm"
                          >
                            Mettre à jour
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Commandes du mois */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Commandes du mois</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setIsEditingMonthly(!isEditingMonthly)}
                        >
                          <Edit2 className="h-4 w-4 text-cement-500" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {isEditingMonthly ? (
                          <div className="flex flex-col gap-2">
                            <Input 
                              type="number" 
                              placeholder="Entrez le total mensuel" 
                              value={monthlyTotal}
                              onChange={(e) => setMonthlyTotalState(e.target.value)}
                              className="text-md font-medium"
                            />
                            <Button 
                              className="bg-cement-600 hover:bg-cement-700 w-full" 
                              onClick={handleMonthlyUpdate}
                              size="sm"
                            >
                              Mettre à jour
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="text-2xl font-bold">{Number(monthlyTotal)} tonnes</div>
                            <p className="text-xs text-muted-foreground">Total des commandes ce mois</p>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Dernière mise à jour: {lastUpdateTime.toLocaleTimeString()}
                  </div>
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
