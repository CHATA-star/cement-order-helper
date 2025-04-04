
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2Icon, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWeeklyTotal, getMonthlyTotal, setWeeklyTotal as saveWeeklyTotal, setMonthlyTotal as saveMonthlyTotal, triggerSyncEvent } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderStatsProps {
  isAdmin?: boolean;
}

const OrderStats = ({ isAdmin = false }: OrderStatsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isEditingWeekly, setIsEditingWeekly] = useState(false);
  const [isEditingMonthly, setIsEditingMonthly] = useState(false);
  const [weeklyTotal, setWeeklyTotalState] = useState(0);
  const [monthlyTotal, setMonthlyTotalState] = useState(0);
  const [tempWeekly, setTempWeekly] = useState(0);
  const [tempMonthly, setTempMonthly] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const loadTotals = () => {
    const weekly = getWeeklyTotal();
    const monthly = getMonthlyTotal();
    setWeeklyTotalState(weekly);
    setMonthlyTotalState(monthly);
    setTempWeekly(weekly);
    setTempMonthly(monthly);
    setLastUpdateTime(new Date());
    console.log("OrderStats: Totals loaded", { weekly, monthly, time: new Date().toISOString() });
  };

  useEffect(() => {
    // Charger les totaux depuis le localStorage lors du chargement initial
    loadTotals();
    
    // Conserver les écouteurs d'événements pour les mises à jour manuelles
    const handleStorageChange = (e) => {
      console.log("OrderStats: Storage change detected", e?.key);
      loadTotals();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orderUpdated', loadTotals);
    window.addEventListener('stockUpdated', loadTotals);
    window.addEventListener('syncEvent', loadTotals);
    window.addEventListener('forceDataRefresh', loadTotals);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orderUpdated', loadTotals);
      window.removeEventListener('stockUpdated', loadTotals);
      window.removeEventListener('syncEvent', loadTotals);
      window.removeEventListener('forceDataRefresh', loadTotals);
    };
  }, []);

  const handleSaveWeekly = () => {
    saveWeeklyTotal(tempWeekly);
    setWeeklyTotalState(tempWeekly);
    setIsEditingWeekly(false);
    
    // Déclencher un événement de synchronisation global
    triggerSyncEvent();
    
    toast({
      title: "Statistique mise à jour",
      description: "Le total hebdomadaire a été modifié avec succès.",
    });
  };

  const handleSaveMonthly = () => {
    saveMonthlyTotal(tempMonthly);
    setMonthlyTotalState(tempMonthly);
    setIsEditingMonthly(false);
    
    // Déclencher un événement de synchronisation global
    triggerSyncEvent();
    
    toast({
      title: "Statistique mise à jour",
      description: "Le total mensuel a été modifié avec succès.",
    });
  };

  return (
    <div className={`grid grid-cols-1 ${isMobile ? "" : "md:grid-cols-2"} gap-4 mb-8`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes de la semaine</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={loadTotals}
              title="Rafraîchir"
            >
              <RefreshCw className="h-4 w-4 text-cement-500" />
            </Button>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsEditingWeekly(!isEditingWeekly);
                  setTempWeekly(weeklyTotal);
                }}
              >
                <Edit2Icon className="h-4 w-4 text-cement-500" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingWeekly && isAdmin ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tempWeekly}
                onChange={(e) => setTempWeekly(Number(e.target.value))}
                className="text-2xl font-bold"
              />
              <Button onClick={handleSaveWeekly}>Sauvegarder</Button>
            </div>
          ) : (
            <div className="text-2xl font-bold">{weeklyTotal} tonnes</div>
          )}
          <p className="text-xs text-muted-foreground">
            Total des commandes cette semaine 
            <span className="ml-1 text-gray-400">(Dernière mise à jour: {lastUpdateTime.toLocaleTimeString()})</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes du mois</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={loadTotals}
              title="Rafraîchir"
            >
              <RefreshCw className="h-4 w-4 text-cement-500" />
            </Button>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsEditingMonthly(!isEditingMonthly);
                  setTempMonthly(monthlyTotal);
                }}
              >
                <Edit2Icon className="h-4 w-4 text-cement-500" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingMonthly && isAdmin ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tempMonthly}
                onChange={(e) => setTempMonthly(Number(e.target.value))}
                className="text-2xl font-bold"
              />
              <Button onClick={handleSaveMonthly}>Sauvegarder</Button>
            </div>
          ) : (
            <div className="text-2xl font-bold">{monthlyTotal} tonnes</div>
          )}
          <p className="text-xs text-muted-foreground">
            Total des commandes ce mois
            <span className="ml-1 text-gray-400">(Dernière mise à jour: {lastUpdateTime.toLocaleTimeString()})</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStats;
