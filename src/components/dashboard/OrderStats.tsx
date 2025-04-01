
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2Icon, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWeeklyTotal, getMonthlyTotal, setWeeklyTotal as saveWeeklyTotal, setMonthlyTotal as saveMonthlyTotal } from "@/services/orderService";
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

  const loadTotals = () => {
    const weekly = getWeeklyTotal();
    const monthly = getMonthlyTotal();
    setWeeklyTotalState(weekly);
    setMonthlyTotalState(monthly);
    setTempWeekly(weekly);
    setTempMonthly(monthly);
  };

  useEffect(() => {
    // Charger les totaux depuis le localStorage
    loadTotals();
    
    // Définir un intervalle pour mettre à jour les totaux régulièrement
    const refreshInterval = setInterval(() => {
      loadTotals();
    }, 15000); // Actualiser toutes les 15 secondes
    
    // Ajouter un écouteur pour recharger les totaux si une autre fenêtre les met à jour
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weekly_total' || e.key === 'monthly_total' || e.key === 'cement_orders') {
        loadTotals();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orderUpdated', loadTotals);
    
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orderUpdated', loadTotals);
    };
  }, []);

  const handleSaveWeekly = () => {
    saveWeeklyTotal(tempWeekly);
    setWeeklyTotalState(tempWeekly);
    setIsEditingWeekly(false);
    
    // Dispatch un événement personnalisé pour notifier les autres fenêtres
    window.dispatchEvent(new CustomEvent('orderUpdated'));
    
    toast({
      title: "Statistique mise à jour",
      description: "Le total hebdomadaire a été modifié avec succès.",
    });
  };

  const handleSaveMonthly = () => {
    saveMonthlyTotal(tempMonthly);
    setMonthlyTotalState(tempMonthly);
    setIsEditingMonthly(false);
    
    // Dispatch un événement personnalisé pour notifier les autres fenêtres
    window.dispatchEvent(new CustomEvent('orderUpdated'));
    
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
          {isAdmin && (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={loadTotals}
                title="Rafraîchir"
              >
                <RefreshCw className="h-4 w-4 text-cement-500" />
              </Button>
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
            </div>
          )}
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
          <p className="text-xs text-muted-foreground">Total des commandes cette semaine</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes du mois</CardTitle>
          {isAdmin && (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={loadTotals}
                title="Rafraîchir"
              >
                <RefreshCw className="h-4 w-4 text-cement-500" />
              </Button>
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
            </div>
          )}
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
          <p className="text-xs text-muted-foreground">Total des commandes ce mois</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStats;
