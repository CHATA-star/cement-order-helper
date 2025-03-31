
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import { getCurrentUser } from "@/services/registrationService";
import { useToast } from "@/hooks/use-toast";

const Reviews = () => {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!currentUser) {
      toast({
        title: "Accès restreint",
        description: "Vous devez être connecté pour accéder à la page des avis clients.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [currentUser, navigate, toast]);

  // Si l'utilisateur n'est pas connecté, ne pas rendre le contenu (pour éviter un flash avant la redirection)
  if (!currentUser) {
    return null;
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-12">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-cement-800 mb-4">
            Avis de nos clients
          </h1>
          <p className="text-cement-600 mb-8">
            Découvrez ce que nos clients disent de nos produits et services. 
            Partagez votre expérience avec CHATA CIMENT pour nous aider à nous améliorer.
          </p>
        </section>

        <ReviewsSection />
      </div>
    </MainLayout>
  );
};

export default Reviews;
