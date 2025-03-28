
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MessageSquare, Clock, FileText } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

interface OrderDetails {
  establishmentName: string;
  quantity: number;
  phoneNumber: string;
  city: string;
}

// Updated with international format
const WHATSAPP_NUMBER = "+2290161080251";

const Confirmation = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("cementOrder");
    
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
      // Generate a random order number
      setOrderNumber(`CMD-${Math.floor(100000 + Math.random() * 900000)}`);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleNewOrder = () => {
    sessionStorage.removeItem("cementOrder");
    navigate("/");
  };

  const handleWhatsAppContact = () => {
    const message = `Bonjour, je voudrais suivre le statut de ma commande de ciment:
    - N° de commande: ${orderNumber}
    - Établissement: ${orderDetails?.establishmentName}
    - Quantité: ${orderDetails?.quantity} tonnes
    - Ville de livraison: ${orderDetails?.city}
    - Téléphone: ${orderDetails?.phoneNumber}
    - Date de demande: ${new Date().toLocaleDateString()}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodedMessage}`, '_blank');
  };
  
  const handlePrint = () => {
    window.print();
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
        <Card className="border-cement-200 shadow-lg print:shadow-none print:border-none">
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
            <div className="bg-cement-50 p-4 rounded-md border border-cement-100 print:border-gray-300">
              <div className="flex justify-between mb-3">
                <div>
                  <span className="text-sm text-cement-600">N° de commande:</span>
                  <p className="font-medium">{orderNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-cement-600">Date:</span>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
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
                  <span className="text-cement-600">Ville de livraison :</span>
                  <span className="font-medium">{orderDetails.city}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-cement-600">Téléphone :</span>
                  <span className="font-medium">{orderDetails.phoneNumber}</span>
                </li>
              </ul>
            </div>
            
            <p className="text-center text-sm text-cement-500">
              Un représentant vous contactera bientôt au {orderDetails.phoneNumber} pour confirmer votre commande et finaliser la livraison à {orderDetails.city}.
            </p>

            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Suivi via WhatsApp</p>
                  <p className="text-xs text-green-700 mt-1">
                    Pour un suivi rapide, vous pouvez contacter notre service commercial via WhatsApp 
                    au <span className="font-semibold">{WHATSAPP_NUMBER}</span> avec votre numéro de commande.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-green-100 border-green-200 hover:bg-green-200 text-green-800"
                    onClick={handleWhatsAppContact}
                  >
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Contacter par WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between print:hidden">
            <Button 
              onClick={handleNewOrder}
              className="bg-cement-600 hover:bg-cement-700 text-white"
            >
              Nouvelle Commande
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="border-cement-200"
            >
              <FileText className="mr-2 h-4 w-4" />
              Imprimer / Télécharger
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Confirmation;
