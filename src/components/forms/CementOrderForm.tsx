import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Truck, Package, Phone, MapPin, Info, MessageSquare, Clock } from "lucide-react";
import { addOrder } from "@/services/orderService";

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

  const handleWhatsAppClick = () => {
    const message = `Bonjour, je souhaite commander du ciment.
    - Établissement: ${formData.establishmentName || "[Nom de l'établissement]"}
    - Quantité: ${formData.quantity || 0} tonnes
    - Ville de livraison: ${formData.city || "[Ville]"}
    - Téléphone: ${formData.phoneNumber || "[Téléphone]"}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Package className="h-10 w-10 text-cement-600" />
        </div>
        <CardTitle className="text-2xl text-center">Commande de Ciment</CardTitle>
        <CardDescription className="text-center">
          Entrez les informations nécessaires pour votre commande
        </CardDescription>
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
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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

          <div className="bg-green-50 p-3 rounded-md border border-green-100">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Commande via WhatsApp</p>
                <p className="text-xs text-green-700 mt-1">
                  Vous pouvez également soumettre votre commande directement via WhatsApp au <span className="font-semibold">{whatsappNumber}</span>. 
                  Notre équipe commerciale est disponible pour traiter vos demandes rapidement.
                </p>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-green-100 border-green-200 hover:bg-green-200 text-green-800"
                  onClick={handleWhatsAppClick}
                >
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Commander par WhatsApp
                </Button>
              </div>
            </div>
          </div>
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

