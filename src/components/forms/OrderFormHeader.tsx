
import React from "react";
import { Package } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import AvailabilityInfo from "./AvailabilityInfo";

interface OrderFormHeaderProps {
  availableQuantity: number;
}

const OrderFormHeader = ({ availableQuantity }: OrderFormHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-center mb-2">
        <Package className="h-10 w-10 text-cement-600" />
      </div>
      <CardTitle className="text-2xl text-center">Commande de Ciment</CardTitle>
      <CardDescription className="text-center">
        Entrez les informations nécessaires pour votre commande
      </CardDescription>
      <AvailabilityInfo availableQuantity={availableQuantity} />
    </>
  );
};

export default OrderFormHeader;
