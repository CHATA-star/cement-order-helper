
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import SignUpForm from "@/components/forms/SignUpForm";

const Reviews = () => {
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

        <section className="bg-cement-50 py-12 rounded-lg border border-cement-100">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-cement-800 mb-6 text-center">
              Inscrivez-vous pour recevoir nos messages
            </h2>
            <p className="text-cement-600 mb-8 text-center">
              Restez informés de nos offres spéciales et nouveaux produits. 
              Nous vous contacterons uniquement pour des informations pertinentes.
            </p>
            <SignUpForm />
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Reviews;
