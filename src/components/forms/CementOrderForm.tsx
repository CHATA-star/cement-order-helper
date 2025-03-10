
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Truck, Package } from "lucide-react";

interface OrderFormData {
  establishmentName: string;
  quantity: number;
}

const CementOrderForm = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    establishmentName: "",
    quantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
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

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Store order in session storage for confirmation page
      sessionStorage.setItem("cementOrder", JSON.stringify(formData));
      // Navigate to confirmation page
      navigate("/confirmation");
    }, 1500);
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
              placeholder="Quantité de ciment"
              value={formData.quantity || ""}
              onChange={handleChange}
              className="w-full"
            />
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
