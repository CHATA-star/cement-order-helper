
import React, { useState, useEffect } from "react";
import { Info, Edit2, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  // Update tempQuantity when availableQuantity changes (e.g., from localStorage updates)
  useEffect(() => {
    setTempQuantity(availableQuantity);
  }, [availableQuantity]);

  const handleSave = () => {
    onUpdateQuantity(tempQuantity);
    setIsEditing(false);
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
              <span className="font-bold ml-2">{availableQuantity} tonnes</span>
            )}
          </div>
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setIsEditing(!isEditing);
                setTempQuantity(availableQuantity);
              }}
            >
              <Edit2 className="h-4 w-4 text-cement-600" />
            </Button>
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
