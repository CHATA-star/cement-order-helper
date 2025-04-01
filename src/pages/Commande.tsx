
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import CementOrderForm from "@/components/forms/CementOrderForm";
import OrderStats from "@/components/dashboard/OrderStats";
import { Building, Package, MapPin, CheckCircle2, MessageCircle, RefreshCw, Share2, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAvailableStock } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const STOCK_KEY = 'available_stock';
const WEEKLY_TOTAL_KEY = 'weekly_total';
const MONTHLY_TOTAL_KEY = 'monthly_total';
const SYNC_TIMESTAMP_KEY = 'sync_timestamp';

const Commande = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [availableStock, setAvailableStock] = useState(0);
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  
  const updateAllData = () => {
    console.log("Commande: Updating all data from storage");
    setAvailableStock(getAvailableStock());
    window.dispatchEvent(new CustomEvent('forceDataRefresh'));
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const adminToken = searchParams.get('adminToken');
    
    if (adminToken === 'chata123') {
      setIsAdmin(true);
    }

    updateAllData();
    
    const updateInterval = setInterval(updateAllData, 2000);
    
    const handleStorageChange = (e) => {
      console.log("Commande: Storage change detected:", e?.key);
      updateAllData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('stockUpdated', updateAllData);
    window.addEventListener('orderUpdated', updateAllData);
    window.addEventListener('syncEvent', updateAllData);
    
    const pollSyncTimestamp = setInterval(() => {
      const lastSync = localStorage.getItem(SYNC_TIMESTAMP_KEY);
      const currentTimestamp = localStorage.getItem('current_sync_timestamp');
      
      if (lastSync !== currentTimestamp) {
        console.log("Commande: Sync timestamp changed, refreshing data");
        localStorage.setItem('current_sync_timestamp', lastSync || '');
        updateAllData();
      }
    }, 1000);
    
    console.log("Commande: Component mounted and ready for real-time updates");
    
    return () => {
      clearInterval(updateInterval);
      clearInterval(pollSyncTimestamp);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('stockUpdated', updateAllData);
      window.removeEventListener('orderUpdated', updateAllData);
      window.removeEventListener('syncEvent', updateAllData);
    };
  }, [location]);

  const forceRefresh = () => {
    updateAllData();
    localStorage.setItem(SYNC_TIMESTAMP_KEY, new Date().toISOString());
    toast({
      title: "Données actualisées",
      description: "Toutes les informations ont été mises à jour."
    });
  };

  const generateShareLink = () => {
    // Créer le lien de base (URL actuelle sans paramètres)
    const baseUrl = window.location.origin + window.location.pathname;
    
    // Ajouter un paramètre timestamp pour s'assurer que les données sont fraîches
    const timestamp = new Date().getTime();
    const finalLink = `${baseUrl}?syncId=${timestamp}`;
    
    setShareLink(finalLink);
    setShowShareDialog(true);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(
      () => {
        toast({
          title: "Lien copié !",
          description: "Le lien a été copié dans le presse-papiers."
        });
      },
      (err) => {
        console.error("Erreur lors de la copie du lien:", err);
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    );
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-8">
        <section className="text-center max-w-3xl mx-auto mb-4">
          <h2 className="text-2xl font-bold text-cement-800 mb-3">
            Plateforme de Commande de CHATA CIMENT
          </h2>
          <p className="text-cement-600">
            Une solution simple et efficace pour vos commandes de ciment. 
            Remplissez le formulaire ci-dessous pour soumettre votre demande.
          </p>
          {isAdmin && (
            <div className="mt-2 bg-green-100 text-green-800 p-2 rounded-md inline-block">
              ✓ Mode administrateur activé
            </div>
          )}
          <div className="mt-3 flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={forceRefresh}
              className="text-xs gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Actualiser les données
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateShareLink}
              className="text-xs gap-1"
            >
              <Share2 className="h-3 w-3" /> Partager cette page
            </Button>
          </div>
        </section>

        <OrderStats isAdmin={isAdmin} />

        <section className="mb-12">
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-cement-100 p-3 rounded-full mb-4">
                <Building className="h-6 w-6 text-cement-600" />
              </div>
              <h3 className="font-semibold text-cement-800 mb-2">1. Identification</h3>
              <p className="text-cement-500 text-sm">
                Indiquez le nom de votre établissement
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-cement-100 p-3 rounded-full mb-4">
                <Package className="h-6 w-6 text-cement-600" />
              </div>
              <h3 className="font-semibold text-cement-800 mb-2">2. Quantification</h3>
              <p className="text-cement-500 text-sm">
                Précisez la quantité de ciment
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-cement-100 p-3 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-cement-600" />
              </div>
              <h3 className="font-semibold text-cement-800 mb-2">3. Livraison</h3>
              <p className="text-cement-500 text-sm">
                Indiquez la ville de livraison
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-cement-100 p-3 rounded-full mb-4">
                <CheckCircle2 className="h-6 w-6 text-cement-600" />
              </div>
              <h3 className="font-semibold text-cement-800 mb-2">4. Confirmation</h3>
              <p className="text-cement-500 text-sm">
                Validez votre commande
              </p>
            </div>
          </div>

          <CementOrderForm isAdmin={isAdmin} />
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-cement-700 mb-4">
              Votre avis compte pour nous
            </h3>
            <p className="text-cement-600 mb-6 max-w-xl mx-auto">
              Partagez votre expérience avec nos produits et services pour nous aider à nous améliorer constamment.
            </p>
            <Link to="/reviews">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <MessageCircle className="mr-2 h-4 w-4" />
                Voir et laisser des avis
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Partager cette page</DialogTitle>
            <DialogDescription>
              Copiez ce lien et partagez-le avec qui vous voulez. Les données seront automatiquement synchronisées.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input
                value={shareLink}
                readOnly
                className="w-full"
              />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyLinkToClipboard}>
              <span className="sr-only">Copier</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-center mt-6">
            <Button 
              type="button"
              variant="secondary"
              onClick={() => setShowShareDialog(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Commande;
