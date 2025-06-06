
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrder, getAvailableStock, setAvailableStock } from "@/services/orderService";
import OrderFormFields from "./OrderFormFields";
import OrderFormHeader from "./OrderFormHeader";
import WhatsAppSection from "./WhatsAppSection";
import { MessageSquare } from "lucide-react";
import { getCurrentUser } from "@/services/registrationService";

interface OrderFormData {
  establishmentName: string;
  quantity: number;
  phoneNumber: string;
  city: string;
}

interface CementOrderFormProps {
  isAdmin?: boolean;
}

const CementOrderForm = ({ isAdmin = false }: CementOrderFormProps) => {
  const [formData, setFormData] = useState<OrderFormData>({
    establishmentName: "",
    quantity: 0,
    phoneNumber: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [availableQuantity, setAvailableQuantity] = useState(getAvailableStock()); // Fetch from service
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Updated with international format
  const WHATSAPP_NUMBER = "+2290161080251";

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    // Try to get user from session or local storage
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        establishmentName: currentUser.name || prev.establishmentName,
        phoneNumber: currentUser.phoneNumber || prev.phoneNumber
      }));
    }
    
    // Get the latest available stock
    const refreshStock = () => {
      setAvailableQuantity(getAvailableStock());
    };
    
    refreshStock();
    
    // Mettre à jour régulièrement le stock
    const stockInterval = setInterval(refreshStock, 10000); // Toutes les 10 secondes
    
    // Écouter les changements de stock
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'available_stock' || e.key === null) {
        refreshStock();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('stockUpdated', refreshStock);
    
    return () => {
      clearInterval(stockInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('stockUpdated', refreshStock);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!formData.establishmentName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom de votre établissement",
        variant: "destructive",
      });
      return false;
    }

    if (formData.quantity <= 0) {
      toast({
        title: "Erreur",
        description: "La quantité doit être supérieure à 0",
        variant: "destructive",
      });
      return false;
    }

    if (formData.quantity > availableQuantity) {
      toast({
        title: "Erreur",
        description: `La quantité demandée dépasse notre stock disponible (${availableQuantity} tonnes)`,
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre numéro de téléphone",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.city.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer la ville de livraison",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    setAvailableQuantity(newQuantity);
    
    // Mise à jour du stock global pour tous les utilisateurs
    setAvailableStock(newQuantity);
    
    // Notification aux autres fenêtres
    window.dispatchEvent(new CustomEvent('stockUpdated'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    // Ajouter la commande (cela va également la synchroniser avec Supabase)
    const newOrder = createOrder({
      establishmentName: formData.establishmentName,
      quantity: formData.quantity,
      deliveryCity: formData.city,
      contactNumber: formData.phoneNumber,
      additionalNotes: "",
      deliveryAddress: formData.city
    });
    
    // Mettre à jour le stock disponible
    const newStock = availableQuantity - formData.quantity;
    handleUpdateQuantity(newStock);

    setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("cementOrder", JSON.stringify(formData));
      navigate("/confirmation");
    }, 1500);
  };

  const handleWhatsAppSubmit = () => {
    if (!validateForm()) return;
    
    const message = `Salut, je suis le PDG ${formData.establishmentName}, je veux ${formData.quantity} tonnes de ciment à ${formData.city}, je suis au ${formData.phoneNumber}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    // Save order data before redirecting (cela va également la synchroniser avec Supabase)
    createOrder({
      establishmentName: formData.establishmentName,
      quantity: formData.quantity,
      deliveryCity: formData.city,
      contactNumber: formData.phoneNumber,
      additionalNotes: "Commande via WhatsApp",
      deliveryAddress: formData.city
    });
    
    // Mettre à jour le stock disponible
    const newStock = availableQuantity - formData.quantity;
    handleUpdateQuantity(newStock);
    
    sessionStorage.setItem("cementOrder", JSON.stringify(formData));
    
    // Open WhatsApp in a new tab
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-gradient-to-br from-white to-cement-50 shadow-xl border-cement-200">
      <CardHeader className="space-y-1 bg-gradient-to-r from-cement-700 to-cement-800 text-white rounded-t-lg">
        <OrderFormHeader 
          availableQuantity={availableQuantity}
          onUpdateQuantity={handleUpdateQuantity}
          isAdmin={isAdmin}
          displayAvailabilityInfo={true}
        />
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-6">
          <OrderFormFields 
            formData={formData}
            availableQuantity={availableQuantity}
            handleChange={handleChange}
            displayAvailabilityInfo={true}
            onUpdateQuantity={handleUpdateQuantity}
            isAdmin={isAdmin}
          />
          <WhatsAppSection formData={formData} />
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-cement-50 to-cement-100 rounded-b-lg border-t border-cement-200 p-4">
          <Button 
            type="button" 
            onClick={handleWhatsAppSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
            disabled={loading}
          >
            <MessageSquare className="h-5 w-5" />
            {loading ? "Traitement en cours..." : "Commander par WhatsApp"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CementOrderForm;
