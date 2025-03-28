
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Truck, Phone, MapPin } from "lucide-react";
import AvailabilityInfo from "./AvailabilityInfo";

interface OrderFormFieldsProps {
  formData: {
    establishmentName: string;
    quantity: number;
    phoneNumber: string;
    city: string;
  };
  availableQuantity: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayAvailabilityInfo?: boolean;
  onUpdateQuantity?: (newQuantity: number) => void;
  isAdmin?: boolean;
}

const OrderFormFields = ({ 
  formData, 
  availableQuantity, 
  handleChange,
  displayAvailabilityInfo = false,
  onUpdateQuantity = () => {},
  isAdmin = false
}: OrderFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-cement-500" />
          <Label htmlFor="establishmentName">Nom de l'établissement</Label>
        </div>
        <Input
          id="establishmentName"
          name="establishmentName"
          placeholder="Entrez le nom de votre établissement"
          value={formData.establishmentName}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Truck className="h-4 w-4 text-cement-500" />
          <Label htmlFor="quantity">Quantité (en tonnes)</Label>
        </div>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          max={availableQuantity}
          placeholder="Quantité de ciment"
          value={formData.quantity || ""}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      {/* Display availability info between quantity and city */}
      {displayAvailabilityInfo && (
        <div className="my-4">
          <AvailabilityInfo 
            availableQuantity={availableQuantity}
            onUpdateQuantity={onUpdateQuantity}
            isAdmin={isAdmin}
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-cement-500" />
          <Label htmlFor="city">Ville de livraison</Label>
        </div>
        <Input
          id="city"
          name="city"
          type="text"
          placeholder="Ville où le ciment doit être livré"
          value={formData.city}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-cement-500" />
          <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        </div>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="Votre numéro de téléphone"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default OrderFormFields;
