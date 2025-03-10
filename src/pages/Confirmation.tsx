
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

interface OrderDetails {
  establishmentName: string;
  quantity: number;
}

const Confirmation = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("cementOrder");
    
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    } else {
      // Redirect to form if no order data exists
      navigate("/");
    }
  }, [navigate]);

  const handleNewOrder = () => {
    sessionStorage.removeItem("cementOrder");
    navigate("/");
  };

  if (!orderDetails) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement des détails de la commande...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">
        <Card className="border-cement-200 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-cement-800">Commande Confirmée</CardTitle>
            <CardDescription>
              Votre demande a été enregistrée avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-cement-50 p-4 rounded-md border border-cement-100">
              <h3 className="font-medium text-cement-700 mb-2">Détails de la commande :</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-cement-600">Établissement :</span>
                  <span className="font-medium">{orderDetails.establishmentName}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-cement-600">Quantité :</span>
                  <span className="font-medium">{orderDetails.quantity} tonnes</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-cement-600">Date de demande :</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </li>
              </ul>
            </div>
            <p className="text-center text-sm text-cement-500">
              Un représentant vous contactera bientôt pour confirmer votre commande.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={handleNewOrder}
              className="bg-cement-600 hover:bg-cement-700 text-white"
            >
              Nouvelle Commande
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Confirmation;
