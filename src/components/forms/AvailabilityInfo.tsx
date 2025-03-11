
import React from "react";
import { Info, Clock } from "lucide-react";

interface AvailabilityInfoProps {
  availableQuantity: number;
}

const AvailabilityInfo = ({ availableQuantity }: AvailabilityInfoProps) => {
  return (
    <>
      <div className="mt-2 bg-cement-100 p-3 rounded-md flex items-center gap-2">
        <Info className="h-5 w-5 text-cement-600" />
        <p className="text-sm text-cement-700">
          Stock disponible actuellement: <span className="font-bold">{availableQuantity} tonnes</span>
        </p>
      </div>
      <div className="mt-2 bg-amber-50 p-3 rounded-md flex items-start gap-2">
        <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          <span className="font-medium">Délai de livraison:</span> Minimum 24h et maximum 72h après confirmation de votre commande
        </p>
      </div>
    </>
  );
};

export default AvailabilityInfo;
