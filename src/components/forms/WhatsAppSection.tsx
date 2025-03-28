
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface WhatsAppSectionProps {
  formData: {
    establishmentName: string;
    quantity: number;
    city: string;
    phoneNumber: string;
  };
}

// Updated with international format
const WHATSAPP_NUMBER = "+2290161080251";

const WhatsAppSection = ({ formData }: WhatsAppSectionProps) => {
  const { toast } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  const handleWhatsAppClick = () => {
    if (!formData.phoneNumber) {
      toast({
        title: "Numéro manquant",
        description: "Veuillez d'abord saisir votre numéro de téléphone",
        variant: "destructive"
      });
      return;
    }
    
    const message = createWhatsAppMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp and then show the order form dialog
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodedMessage}`, '_blank');
    
    // Wait a moment before showing the order form to ensure WhatsApp is opened first
    setTimeout(() => {
      setShowOrderForm(true);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Get current date for the order form
  const currentDate = new Date().toLocaleDateString();
  const orderNumber = `CMD-${Math.floor(100000 + Math.random() * 900000)}`; // Generate random order number

  return (
    <>
      <div className="bg-green-50 p-3 rounded-md border border-green-100">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">Commande via WhatsApp</p>
            <p className="text-xs text-green-700 mt-1">
              Vous pouvez également soumettre votre commande directement via WhatsApp au <span className="font-semibold">{WHATSAPP_NUMBER}</span>. 
              Notre équipe commerciale est disponible pour traiter vos demandes rapidement.
            </p>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 bg-green-100 border-green-200 hover:bg-green-200 text-green-800"
              onClick={handleWhatsAppClick}
              disabled={!formData.phoneNumber}
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              Commander par WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="sm:max-w-md md:max-w-lg print:shadow-none print:border-none">
          <DialogHeader>
            <DialogTitle className="text-center">Formulaire de Commande</DialogTitle>
            <DialogDescription className="text-center">
              Ce formulaire confirme que vous avez soumis une commande via WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-cement-800">CHATA CIMENT</h2>
                <p className="text-xs text-cement-600">Votre partenaire de confiance pour le ciment</p>
              </div>
            </div>
            
            <Card className="p-4 border border-cement-200 print:border-gray-400">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm font-medium">N° de commande:</p>
                  <p className="text-sm">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date:</p>
                  <p className="text-sm">{currentDate}</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-2 text-cement-700">Détails du client:</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-sm text-cement-600">Établissement:</p>
                  <p className="text-sm font-medium">{formData.establishmentName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-cement-600">Téléphone:</p>
                  <p className="text-sm font-medium">{formData.phoneNumber || "N/A"}</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-2 text-cement-700">Détails de la commande:</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-sm text-cement-600">Quantité:</p>
                  <p className="text-sm font-medium">{formData.quantity} tonnes</p>
                </div>
                <div>
                  <p className="text-sm text-cement-600">Ville de livraison:</p>
                  <p className="text-sm font-medium">{formData.city || "N/A"}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-cement-100">
                <p className="text-xs text-cement-500">
                  Ce formulaire confirme que vous avez initié une commande via WhatsApp au {WHATSAPP_NUMBER}.
                  Notre équipe commerciale vous contactera dans les plus brefs délais pour finaliser votre commande.
                </p>
              </div>
            </Card>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowOrderForm(false)}
              className="sm:w-auto w-full"
            >
              Fermer
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              className="bg-cement-600 hover:bg-cement-700 sm:w-auto w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              Imprimer / Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Separate function for creating the WhatsApp message
const createWhatsAppMessage = (formData: WhatsAppSectionProps["formData"]) => {
  return `Bonjour, je souhaite commander du ciment.
    - Établissement: ${formData.establishmentName || "[Nom de l'établissement]"}
    - Quantité: ${formData.quantity || 0} tonnes
    - Ville de livraison: ${formData.city || "[Ville]"}
    - Téléphone: ${formData.phoneNumber}`;
};

export default WhatsAppSection;
