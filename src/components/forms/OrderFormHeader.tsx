
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import AvailabilityInfo from "./AvailabilityInfo";
import ChataCimentLogo from "../logo/ChataCimentLogo";

interface OrderFormHeaderProps {
  availableQuantity: number;
  onUpdateQuantity: (newQuantity: number) => void;
  isAdmin?: boolean;
  displayAvailabilityInfo?: boolean;
}

const OrderFormHeader = ({ 
  availableQuantity, 
  onUpdateQuantity, 
  isAdmin = false,
  displayAvailabilityInfo = true
}: OrderFormHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-center mb-4">
        <ChataCimentLogo size="lg" className="mb-2" />
      </div>
      <CardTitle className="text-2xl text-center">Commande de Ciment</CardTitle>
      <CardDescription className="text-center">
        Entrez les informations nécessaires pour votre commande
      </CardDescription>
      {isAdmin && displayAvailabilityInfo && (
        <AvailabilityInfo 
          availableQuantity={availableQuantity}
          onUpdateQuantity={onUpdateQuantity}
          isAdmin={isAdmin}
          showDeliveryTime={false}
        />
      )}
    </>
  );
};

export default OrderFormHeader;
