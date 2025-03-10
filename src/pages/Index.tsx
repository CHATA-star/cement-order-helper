
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import CementOrderForm from "@/components/forms/CementOrderForm";
import OrderStats from "@/components/dashboard/OrderStats";
import { Building, Truck, Package, CheckCircle2, MapPin } from "lucide-react";

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
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
