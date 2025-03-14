
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import CementOrderForm from "@/components/forms/CementOrderForm";
import OrderStats from "@/components/dashboard/OrderStats";
import { Building, Truck, Package, CheckCircle2, MapPin, MessageCircle, UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SignUpForm from "@/components/forms/SignUpForm";

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-8">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-cement-800 mb-4">
            Plateforme de Commande de CHATA CIMENT
          </h1>
          <p className="text-cement-600 mb-8">
            Une solution simple et efficace pour vos commandes de ciment. 
            Remplissez le formulaire ci-dessous pour soumettre votre demande.
          </p>
        </section>

        {/* Account Registration Section - Moved to top */}
        <section className="bg-gradient-to-r from-cement-50 to-cement-100 py-12 rounded-lg border border-cement-200 mb-8">
          <div className="max-w-xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex bg-white p-3 rounded-full shadow-sm mb-4">
                <UserPlus className="h-8 w-8 text-cement-600" />
              </div>
              <h2 className="text-2xl font-bold text-cement-800 mb-4">
                Créez votre compte CHATA CIMENT
              </h2>
              <p className="text-cement-600">
                Inscrivez-vous pour accéder plus facilement à notre plateforme et bénéficier d'un suivi personnalisé de vos commandes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <SignUpForm />
            </div>
            
            <div className="text-center mt-6">
              <p className="text-cement-500 text-sm">
                Déjà inscrit ? <Link to="/" className="text-cement-700 font-medium hover:underline inline-flex items-center"><LogIn className="h-3 w-3 mr-1" /> Connectez-vous</Link>
              </p>
            </div>
          </div>
        </section>

        <OrderStats />

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

          <CementOrderForm />
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-cement-700 mb-4">
              Votre avis compte pour nous
            </h3>
            <p className="text-cement-600 mb-6 max-w-xl mx-auto">
              Partagez votre expérience avec nos produits et services pour nous aider à nous améliorer constamment.
            </p>
            <Link to="/reviews">
              <Button className="bg-cement-600 hover:bg-cement-700">
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

export default Index;
