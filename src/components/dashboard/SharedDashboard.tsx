
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAvailableStock, 
  getWeeklyTotal, 
  getMonthlyTotal,
  triggerSyncEvent,
  setupBroadcastListeners
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
  const [isLoading, setIsLoading] = useState(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const refreshIntervalRef = useRef<number | null>(null);
  const visibilityCallbackRef = useRef<(() => void) | null>(null);

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
    
    // Configurer un intervalle pour rafraîchir les valeurs régulièrement
    // Les appareils mobiles ont besoin de mises à jour plus fréquentes pour assurer la synchronisation
    const refreshInterval = setInterval(loadValues, isMobile ? 15000 : 30000);
    refreshIntervalRef.current = refreshInterval as unknown as number;
    
    // Configurer le canal de broadcast pour une communication en temps réel
    broadcastChannelRef.current = setupBroadcastListeners();
    
    // Écouter les événements pour les mises à jour manuelles
    window.addEventListener('storage', loadValues);
    window.addEventListener('orderUpdated', loadValues);
    window.addEventListener('stockUpdated', loadValues);
    window.addEventListener('syncEvent', loadValues);
    window.addEventListener('forceDataRefresh', loadValues);
    
    // Configurer un effet de rafraîchissement supplémentaire pour les appareils mobiles
    // en cas de retour sur l'application après mise en veille
    if (isMobile) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log("Mobile app became visible, refreshing data");
          loadValues();
          triggerSyncEvent(); // Demander une mise à jour à toutes les instances
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      visibilityCallbackRef.current = handleVisibilityChange;
    }
    
    // Exécuter une synchronisation forcée au chargement
    triggerSyncEvent();
    
    return () => {
      // Nettoyer tous les écouteurs et intervalles
      if (refreshIntervalRef.current !== null) {
        clearInterval(refreshIntervalRef.current);
      }
      
      window.removeEventListener('storage', loadValues);
      window.removeEventListener('orderUpdated', loadValues);
      window.removeEventListener('stockUpdated', loadValues);
      window.removeEventListener('syncEvent', loadValues);
      window.removeEventListener('forceDataRefresh', loadValues);
      
      // Fermer le canal de broadcast si ouvert
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      
      // Supprimer l'écouteur de visibilité si configuré
      if (isMobile && visibilityCallbackRef.current) {
        document.removeEventListener('visibilitychange', visibilityCallbackRef.current);
      }
    };
  }, [isMobile]);

  const handleRefresh = () => {
    setIsLoading(true);
    loadValues();
    
    // Permettre les modifications même en production pour les administrateurs
    if (isAdmin) {
      triggerSyncEvent();
    }
    
    toast({
      title: "Données actualisées",
      description: "Les informations du tableau de bord ont été mises à jour sur toutes les plateformes."
    });
    
    // Ajouter un délai pour l'animation de chargement
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
          disabled={isLoading}
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>
      
      <div className={`grid grid-cols-1 ${!isMobile ? "md:grid-cols-3" : ""} gap-4`}>
        {/* Stock disponible - Optimisé pour mobile avec icônes plus visibles */}
        <Card className="bg-amber-50/50">
          <CardHeader className={`${isMobile ? "py-2 px-3" : "pb-2"}`}>
            <CardTitle className={`${isMobile ? "text-xs" : "text-sm"} font-medium text-amber-700`}>Stock disponible</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "pt-0 px-3 pb-3" : ""}>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold text-amber-800`}>{availableStock} tonnes</div>
            <p className="text-xs text-amber-600">Capacité restante</p>
          </CardContent>
        </Card>
        
        {/* Commandes hebdomadaires */}
        <Card>
          <CardHeader className={`${isMobile ? "py-2 px-3" : "pb-2"}`}>
            <CardTitle className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>Commandes de la semaine</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "pt-0 px-3 pb-3" : ""}>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>{weeklyTotal} tonnes</div>
            <p className="text-xs text-muted-foreground">Total des commandes cette semaine</p>
          </CardContent>
        </Card>
        
        {/* Commandes mensuelles */}
        <Card>
          <CardHeader className={`${isMobile ? "py-2 px-3" : "pb-2"}`}>
            <CardTitle className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>Commandes du mois</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "pt-0 px-3 pb-3" : ""}>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>{monthlyTotal} tonnes</div>
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
