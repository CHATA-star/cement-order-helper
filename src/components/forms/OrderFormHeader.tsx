
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import AvailabilityInfo from "./AvailabilityInfo";
import ChataCimentLogo from "../logo/ChataCimentLogo";

interface OrderFormHeaderProps {
  availableQuantity: number;
  onUpdateQuantity: (newQuantity: number) => void;
}

const OrderFormHeader = ({ availableQuantity, onUpdateQuantity }: OrderFormHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-center mb-4">
        <ChataCimentLogo size="lg" className="mb-2" />
      </div>
      <CardTitle className="text-2xl text-center">Commande de Ciment</CardTitle>
      <CardDescription className="text-center">
        Entrez les informations nécessaires pour votre commande
      </CardDescription>
      <AvailabilityInfo 
        availableQuantity={availableQuantity}
        onUpdateQuantity={onUpdateQuantity}
      />
    </>
  );
};

export default OrderFormHeader;
