
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import { getCurrentUser } from "@/services/registrationService";

const Reviews = () => {
  const currentUser = getCurrentUser();
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-12">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-cement-800 mb-4">
            Avis de nos clients
          </h1>
          <p className="text-cement-600 mb-8">
            Découvrez ce que nos clients disent de nos produits et services. 
            {currentUser ? (
              " Partagez votre expérience avec CHATA CIMENT pour nous aider à nous améliorer."
            ) : (
              " Connectez-vous pour partager votre expérience."
            )}
          </p>
        </section>

        <ReviewsSection />
      </div>
    </MainLayout>
  );
};

export default Reviews;
