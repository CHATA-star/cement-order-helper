
import React, { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/services/registrationService";

const Login = () => {
  const navigate = useNavigate();
  
  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Si l'utilisateur est déjà connecté, rediriger vers la page de commande
      navigate('/commande');
    }
  }, [navigate]);

  return (
    <MainLayout>
      <div className="flex flex-col space-y-8">
        {/* En-tête Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-700 mb-4">
            Connexion à CHATA CIMENT
          </h1>
          <p className="text-amber-600 mb-8 text-lg">
            Connectez-vous à votre compte pour passer votre commande.
          </p>
        </section>

        {/* Section de connexion - Fond gris */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-12 rounded-lg border border-blue-200 mb-8">
          <div className="max-w-xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex bg-white p-3 rounded-full shadow-sm mb-4">
                <LogIn className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Connectez-vous à votre compte
              </h2>
              <p className="text-blue-600">
                Entrez vos identifiants pour accéder à notre plateforme de commande.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <LoginForm />
            </div>
            
            <div className="text-center mt-6">
              <p className="text-blue-500 text-sm">
                Pas encore de compte ? <Link to="/" className="text-blue-700 font-medium hover:underline">Créez votre compte</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Login;
