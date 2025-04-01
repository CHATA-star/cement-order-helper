
import React, { useState, useEffect } from "react";
import { Info, Edit2, Clock, Package, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

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
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Update tempQuantity when availableQuantity changes (e.g., from localStorage updates)
  useEffect(() => {
    if (availableQuantity !== prevQuantity) {
      setPrevQuantity(availableQuantity);
      setTempQuantity(availableQuantity);
    }
  }, [availableQuantity, prevQuantity]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log("AvailabilityInfo: Storage event detected", e?.key);
      // Force refresh data on storage change
      window.dispatchEvent(new CustomEvent('stockUpdated'));
    };
    
    const handleStockUpdate = () => {
      console.log("AvailabilityInfo: Stock update event received");
      // This handler is empty because the component will get updated props from parent
      // Just for debugging purposes
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('stockUpdated', handleStockUpdate);
    
    // Trigger initial check
    window.dispatchEvent(new Event('storage'));
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('stockUpdated', handleStockUpdate);
    };
  }, []);

  const handleSave = () => {
    // Verify that the quantity is valid
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
    
    // Trigger stock update events for other windows/tabs
    window.dispatchEvent(new CustomEvent('stockUpdated'));
    
    // Force a storage event for all tabs/windows
    localStorage.setItem('last_update', new Date().toISOString());
    
    // Show success notification
    toast({
      title: "Stock mis à jour",
      description: `Le stock disponible a été actualisé à ${tempQuantity} tonnes.`
    });
  };

  const refreshData = () => {
    // Trigger a storage event to force a refresh from localStorage
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('stockUpdated'));
    
    toast({
      title: "Données actualisées",
      description: "Les informations de stock ont été rafraîchies."
    });
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
        <div className="flex items-center justify-between">
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
                <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
              </div>
            ) : (
              <div className="font-bold ml-2 flex items-center">
                <span>{availableQuantity} tonnes</span>
                {renderQuantityChange()}
              </div>
            )}
          </div>
          {isAdmin && (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={refreshData}
                title="Rafraîchir les données"
                className="h-8 w-8"
              >
                <RefreshCw className="h-4 w-4 text-cement-600" />
              </Button>
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
            </div>
          )}
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
