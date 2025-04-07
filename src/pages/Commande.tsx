
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import CementOrderForm from "@/components/forms/CementOrderForm";
import OrderStats from "@/components/dashboard/OrderStats";
import SharedDashboard from "@/components/dashboard/SharedDashboard";
import { Building, Package, MapPin, CheckCircle2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAvailableStock, setupBroadcastListeners, forceSyncAllPlatforms } from "@/services/orderService";
import { useIsMobile } from "@/hooks/use-mobile";

const Commande = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const adminToken = searchParams.get('adminToken');
    
    if (adminToken === 'chata123') {
      setIsAdmin(true);
    }
    
    // Configurer les écouteurs pour la communication entre onglets et plateformes
    const broadcastChannel = setupBroadcastListeners();
    
    // Déclenchement d'un événement pour forcer la mise à jour des données
    window.dispatchEvent(new CustomEvent('forceDataRefresh'));
    
    // Synchronisation forcée pour assurer la cohérence sur toutes les plateformes
    forceSyncAllPlatforms();
    
    // Écouteur pour les changements de visibilité (passage en premier plan/arrière-plan)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Commande page became visible, forcing refresh");
        window.dispatchEvent(new CustomEvent('forceDataRefresh'));
        forceSyncAllPlatforms();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Synchronisation périodique pour les appareils mobiles
    const syncInterval = isMobile ? 
      setInterval(() => forceSyncAllPlatforms(), 60000) : null;
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (syncInterval) clearInterval(syncInterval);
      if (broadcastChannel) broadcastChannel.close();
    };
  }, [location, isMobile]);

  return (
    <MainLayout>
      <div className="flex flex-col space-y-8">
        <section className="text-center max-w-3xl mx-auto mb-4">
          <h2 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold text-cement-800 mb-3`}>
            Plateforme de Commande de CHATA CIMENT
          </h2>
          <p className="text-cement-600 text-sm md:text-base">
            Une solution simple et efficace pour vos commandes de ciment. 
            Remplissez le formulaire ci-dessous pour soumettre votre demande.
          </p>
          {isAdmin && (
            <div className="mt-2 bg-green-100 text-green-800 p-2 rounded-md inline-block">
              ✓ Mode administrateur activé
            </div>
          )}
        </section>

        {/* Afficher le tableau de bord partagé avec les données synchronisées */}
        <Card>
          <CardContent className={`${isMobile ? "p-3" : "pt-6"}`}>
            <SharedDashboard isAdmin={isAdmin} />
          </CardContent>
        </Card>

        <section className="mb-12">
          <div className={`grid ${isMobile ? "grid-cols-2" : "md:grid-cols-4"} gap-4 mb-10`}>
            <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-cement-100 p-3 rounded-full mb-4">
                <Building className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-cement-600`} />
              </div>
              <h3 className="font-semibold text-cement-800 mb-2 text-sm md:text-base">1. Identification</h3>
              <p className="text-cement-500 text-xs md:text-sm">
                Indiquez le nom de votre établissement
              </p>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-cement-100 p-3 rounded-full mb-4">
                <Package className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-cement-600`} />
              </div>
              <h3 className="font-semibold text-cement-800 mb-2 text-sm md:text-base">2. Quantification</h3>
              <p className="text-cement-500 text-xs md:text-sm">
                Précisez la quantité de ciment
              </p>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-cement-100 p-3 rounded-full mb-4">
                <MapPin className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-cement-600`} />
              </div>
              <h3 className="font-semibold text-cement-800 mb-2 text-sm md:text-base">3. Livraison</h3>
              <p className="text-cement-500 text-xs md:text-sm">
                Indiquez la ville de livraison
              </p>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-cement-100 p-3 rounded-full mb-4">
                <CheckCircle2 className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-cement-600`} />
              </div>
              <h3 className="font-semibold text-cement-800 mb-2 text-sm md:text-base">4. Confirmation</h3>
              <p className="text-cement-500 text-xs md:text-sm">
                Validez votre commande
              </p>
            </div>
          </div>

          <CementOrderForm isAdmin={isAdmin} />
          
          <div className="mt-12 text-center">
            <h3 className={`${isMobile ? "text-lg" : "text-xl"} font-semibold text-cement-700 mb-4`}>
              Votre avis compte pour nous
            </h3>
            <p className="text-cement-600 mb-6 max-w-xl mx-auto text-sm md:text-base">
              Partagez votre expérience avec nos produits et services pour nous aider à nous améliorer constamment.
            </p>
            <Link to="/reviews">
              <Button className="bg-red-600 hover:bg-red-700 text-white text-sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                Voir et laisser des avis
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Commande;
