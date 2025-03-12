import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addOrder } from "@/services/orderService";
import OrderFormFields from "./OrderFormFields";
import OrderFormHeader from "./OrderFormHeader";
import WhatsAppSection from "./WhatsAppSection";

interface OrderFormData {
  establishmentName: string;
  quantity: number;
  phoneNumber: string;
  city: string;
}

const CementOrderForm = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    establishmentName: "",
    quantity: 0,
    phoneNumber: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const availableQuantity = 2000; // en tonnes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.establishmentName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom de votre établissement",
        variant: "destructive",
      });
      return;
    }

    if (formData.quantity <= 0) {
      toast({
        title: "Erreur",
        description: "La quantité doit être supérieure à 0",
        variant: "destructive",
      });
      return;
    }

    if (formData.quantity > availableQuantity) {
      toast({
        title: "Erreur",
        description: `La quantité demandée dépasse notre stock disponible (${availableQuantity} tonnes)`,
        variant: "destructive",
      });
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre numéro de téléphone",
        variant: "destructive",
      });
      return;
    }

    if (!formData.city.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer la ville de livraison",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    addOrder(formData);

    setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("cementOrder", JSON.stringify(formData));
      navigate("/confirmation");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <OrderFormHeader availableQuantity={availableQuantity} />
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <OrderFormFields 
            formData={formData}
            availableQuantity={availableQuantity}
            handleChange={handleChange}
          />
          <WhatsAppSection formData={formData} />
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-cement-600 hover:bg-cement-700 text-white"
            disabled={loading}
          >
            {loading ? "Traitement en cours..." : "Soumettre la commande"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CementOrderForm;
