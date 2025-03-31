
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { getCurrentUser } from "@/services/registrationService";
import { useNavigate } from "react-router-dom";

// Define the review type
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
}

// Mock initial reviews data
const initialReviews: Review[] = [
  {
    id: "1",
    name: "Jean Dupont",
    rating: 5,
    comment: "Excellent service et livraison rapide. Le ciment est de très bonne qualité.",
    product: "Ciment Portland",
    date: "2023-10-15",
  },
  {
    id: "2",
    name: "Marie Lefebvre",
    rating: 4,
    comment: "Bon produit mais la livraison a été un peu retardée.",
    product: "Ciment CPA",
    date: "2023-09-22",
  },
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  const handleAddReview = (newReview: Omit<Review, "id" | "date">) => {
    const review = {
      ...newReview,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    };
    
    setReviews([review, ...reviews]);
    setShowForm(false);
    
    toast({
      title: "Avis ajouté",
      description: "Merci pour votre commentaire !",
    });
  };

  const handleReviewButtonClick = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-cement-800">
          {reviews.length} Avis clients
        </h2>
        <Button 
          onClick={handleReviewButtonClick}
          className="bg-cement-600 hover:bg-cement-700"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          {showForm ? "Annuler" : "Ajouter un avis"}
        </Button>
      </div>
      
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-cement-100">
          <ReviewForm 
            onSubmit={handleAddReview} 
            onCancel={() => setShowForm(false)}
            userName={currentUser?.name || ""}
          />
        </div>
      )}
      
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ReviewsSection;
