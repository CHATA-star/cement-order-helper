
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import SignUpForm from "@/components/forms/SignUpForm";

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-8">
        {/* Warm Welcome Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-700 mb-4">
            Bienvenue chez CHATA CIMENT
          </h1>
          <p className="text-amber-600 mb-8 text-lg">
            Nous sommes ravis de vous accueillir sur notre plateforme. Pour profiter pleinement de nos services 
            et suivre vos commandes, créez votre compte dès maintenant.
          </p>
        </section>

        {/* Account Registration Section - Green background */}
        <section className="bg-gradient-to-r from-green-50 to-green-100 py-12 rounded-lg border border-green-200 mb-8">
          <div className="max-w-xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex bg-white p-3 rounded-full shadow-sm mb-4">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Créez votre compte CHATA CIMENT
              </h2>
              <p className="text-green-600">
                Inscrivez-vous pour accéder plus facilement à notre plateforme et bénéficier d'un suivi personnalisé de vos commandes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <SignUpForm />
            </div>
            
            <div className="text-center mt-6">
              <p className="text-green-500 text-sm">
                Déjà inscrit ? <Link to="/commande" className="text-green-700 font-medium hover:underline inline-flex items-center"><LogIn className="h-3 w-3 mr-1" /> Connectez-vous et commandez</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-cement-700 mb-4">
            Une fois inscrit, vous pourrez passer votre commande
          </h2>
          <p className="text-cement-600 mb-6">
            Après avoir créé votre compte, vous serez dirigé vers notre plateforme de commande où vous pourrez commander du ciment facilement.
          </p>
          <Link to="/commande" className="bg-cement-700 hover:bg-cement-800 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-colors">
            Aller directement à la page de commande
          </Link>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
