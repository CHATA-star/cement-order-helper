
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAvailableStock, 
  getWeeklyTotal, 
  getMonthlyTotal,
  triggerSyncEvent
} from "@/services/orderService";
import { useIsMobile } from "@/hooks/use-mobile";

interface SharedDashboardProps {
  isAdmin?: boolean;
}

const SharedDashboard: React.FC<SharedDashboardProps> = ({ isAdmin = false }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Fonction pour charger manuellement les valeurs
  const loadValues = () => {
    const currentStock = getAvailableStock();
    const currentWeekly = getWeeklyTotal();
    const currentMonthly = getMonthlyTotal();
    
    setAvailableStock(currentStock);
    setWeeklyTotal(currentWeekly);
    setMonthlyTotal(currentMonthly);
    setLastUpdateTime(new Date());
    
    console.log("SharedDashboard: Values loaded", { 
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
    
    return () => {
      window.removeEventListener('storage', loadValues);
      window.removeEventListener('orderUpdated', loadValues);
      window.removeEventListener('stockUpdated', loadValues);
      window.removeEventListener('syncEvent', loadValues);
      window.removeEventListener('forceDataRefresh', loadValues);
    };
  }, []);

  const handleRefresh = () => {
    loadValues();
    triggerSyncEvent();
    
    toast({
      title: "Données actualisées",
      description: "Les informations du tableau de bord ont été mises à jour."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`${isMobile ? "text-lg" : "text-xl"} font-semibold text-cement-700`}>
          Tableau de bord des commandes
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2 text-xs"
        >
          <RefreshCw className="h-3 w-3" />
          Actualiser
        </Button>
      </div>
      
      <div className={`grid grid-cols-1 ${!isMobile ? "md:grid-cols-3" : ""} gap-4`}>
        {/* Stock disponible */}
        <Card className="bg-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Stock disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">{availableStock} tonnes</div>
            <p className="text-xs text-amber-600">Capacité restante</p>
          </CardContent>
        </Card>
        
        {/* Commandes hebdomadaires */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Commandes de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyTotal} tonnes</div>
            <p className="text-xs text-muted-foreground">Total des commandes cette semaine</p>
          </CardContent>
        </Card>
        
        {/* Commandes mensuelles */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Commandes du mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyTotal} tonnes</div>
            <p className="text-xs text-muted-foreground">Total des commandes ce mois</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Dernière mise à jour: {lastUpdateTime.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SharedDashboard;
