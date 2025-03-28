import React, { useState } from "react";
import { Info, Edit2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleSave = () => {
    onUpdateQuantity(tempQuantity);
    setIsEditing(false);
  };

  // For regular users (non-admin), return null as we don't want to show any information
  if (!isAdmin && !showDeliveryTime) {
    return null;
  }

  return (
    <>
      {isAdmin && (
        <div className="mt-2 bg-cement-100 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-cement-600" />
              <p className="text-sm text-cement-700">
                Stock disponible actuellement: 
                {isEditing ? (
                  <span className="ml-2 inline-flex items-center gap-2">
                    <Input
                      type="number"
                      value={tempQuantity}
                      onChange={(e) => setTempQuantity(Number(e.target.value))}
                      className="w-32 h-8 text-sm"
                    />
                    <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
                  </span>
                ) : (
                  <span className="font-bold ml-2">{availableQuantity} tonnes</span>
                )}
              </p>
            </div>
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
          </div>
        </div>
      )}
      
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
