
import React, { useState, useEffect } from "react";
import { Info, Edit2, Clock, Package, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { triggerSyncEvent } from "@/services/orderService";

interface AvailabilityInfoProps {
  availableQuantity: number;
  onUpdateQuantity: (newQuantity: number) => void;
  isAdmin?: boolean;
  showDeliveryTime?: boolean;
}

const AvailabilityInfo = ({ 
  availableQuantity, 
  onUpdateQuantity, 
  isAdmin = false, 
  showDeliveryTime = false 
}: AvailabilityInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(availableQuantity);
  const [prevQuantity, setPrevQuantity] = useState(availableQuantity);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    if (availableQuantity !== prevQuantity) {
      setPrevQuantity(availableQuantity);
      setTempQuantity(availableQuantity);
      setLastUpdateTime(new Date());
    }
  }, [availableQuantity, prevQuantity]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log("AvailabilityInfo: Storage event detected", e?.key);
      refreshData();
    };
    
    const handleStockUpdate = () => {
      console.log("AvailabilityInfo: Stock update event received");
      setLastUpdateTime(new Date());
    };
    
    const handleForceRefresh = () => {
      console.log("AvailabilityInfo: Forced refresh event received");
      refreshData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('stockUpdated', handleStockUpdate);
    window.addEventListener('syncEvent', handleStockUpdate);
    window.addEventListener('forceDataRefresh', handleForceRefresh);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('stockUpdated', handleStockUpdate);
      window.removeEventListener('syncEvent', handleStockUpdate);
      window.removeEventListener('forceDataRefresh', handleForceRefresh);
    };
  }, []);

  const handleSave = () => {
    if (tempQuantity < 0) {
      toast({
        title: "Erreur de quantité",
        description: "La quantité ne peut pas être négative",
        variant: "destructive"
      });
      return;
    }

    onUpdateQuantity(tempQuantity);
    setPrevQuantity(tempQuantity);
    setIsEditing(false);
    setLastUpdateTime(new Date());
    
    triggerSyncEvent();
    
    toast({
      title: "Stock mis à jour",
      description: `Le stock disponible a été actualisé à ${tempQuantity} tonnes.`
    });
  };

  const refreshData = () => {
    setLastUpdateTime(new Date());
  };

  const renderQuantityChange = () => {
    const diff = availableQuantity - prevQuantity;
    if (diff === 0 || isEditing) return null;
    
    return diff > 0 ? (
      <div className="ml-2 flex items-center text-green-600">
        <ArrowUp className="h-3 w-3 mr-1" />
        <span className="text-xs font-medium">{`+${diff}`}</span>
      </div>
    ) : (
      <div className="ml-2 flex items-center text-red-600">
        <ArrowDown className="h-3 w-3 mr-1" />
        <span className="text-xs font-medium">{diff}</span>
      </div>
    );
  };

  return (
    <>
      <div className="mt-2 bg-cement-100 p-3 rounded-md">
        <div className="flex items-center justify-between flex-wrap">
          <div className={`flex ${isMobile ? "flex-col items-start" : "items-center"} gap-2`}>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-cement-600" />
              <p className="text-sm text-cement-700">
                Stock disponible actuellement:
              </p>
            </div>
            {isAdmin && isEditing ? (
              <div className={`${isMobile ? "w-full mt-2" : "ml-2"} inline-flex items-center gap-2`}>
                <Input
                  type="number"
                  value={tempQuantity}
                  onChange={(e) => setTempQuantity(Number(e.target.value))}
                  className={`${isMobile ? "w-full" : "w-32"} h-8 text-sm`}
                />
                <Button size="sm" onClick={handleSave} className="whitespace-nowrap">Sauvegarder</Button>
              </div>
            ) : (
              <div className="font-bold ml-2 flex items-center">
                <span>{availableQuantity} tonnes</span>
                {renderQuantityChange()}
              </div>
            )}
          </div>
          <div className="flex space-x-1 mt-2 md:mt-0">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                refreshData();
                window.dispatchEvent(new CustomEvent('forceDataRefresh'));
                localStorage.setItem('sync_timestamp', new Date().toISOString());
              }}
              title="Rafraîchir les données"
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4 text-cement-600" />
            </Button>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setTempQuantity(availableQuantity);
                }}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4 text-cement-600" />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Dernière mise à jour: {lastUpdateTime.toLocaleTimeString()}
        </div>
      </div>
      
      {showDeliveryTime && (
        <div className="mt-2 bg-amber-50 p-3 rounded-md flex items-start gap-2">
          <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <span className="font-medium">Délai de livraison:</span> Minimum 24h et maximum 72h après confirmation de votre commande
          </p>
        </div>
      )}
    </>
  );
};

export default AvailabilityInfo;
