import React from 'react';

interface Review {
  name: string;
  text: string;
  rating: number; // Rating out of 5
}

interface CustomerReviewsProps {
  reviews: Review[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  return (
    <div className="customer-reviews bg-gray-50 p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review, index) => (
          <div key={index} className="review bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-gray-600">"{review.text}"</p>
            <div className="mt-2">
              <span className="font-semibold">- {review.name}</span>
              <span className="ml-2 text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;