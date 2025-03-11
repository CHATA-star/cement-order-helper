
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface WhatsAppSectionProps {
  formData: {
    establishmentName: string;
    quantity: number;
    city: string;
    phoneNumber: string;
  };
}

const WHATSAPP_NUMBER = "0161080251";

const WhatsAppSection = ({ formData }: WhatsAppSectionProps) => {
  const handleWhatsAppClick = () => {
    const message = `Bonjour, je souhaite commander du ciment.
    - Établissement: ${formData.establishmentName || "[Nom de l'établissement]"}
    - Quantité: ${formData.quantity || 0} tonnes
    - Ville de livraison: ${formData.city || "[Ville]"}
    - Téléphone: ${formData.phoneNumber || "[Téléphone]"}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
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
          >
            <MessageSquare className="mr-1 h-4 w-4" />
            Commander par WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSection;
