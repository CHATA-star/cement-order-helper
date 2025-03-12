
import React from "react";
import { Review } from "./ReviewsSection";
import { Star, Calendar, Package } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-cement-500">
          <p>Aucun avis client pour le moment. Soyez le premier à partager votre expérience !</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-cement-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-cement-800 text-lg">{review.name}</h3>
                <div className="flex items-center mt-1 mb-3">
                  <div className="flex mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center text-cement-500 text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-cement-500 text-sm">
                <Package className="h-3.5 w-3.5 mr-1" />
                <span>{review.product}</span>
              </div>
            </div>
            <p className="text-cement-600">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
