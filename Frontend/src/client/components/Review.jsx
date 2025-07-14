import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Review = ({ reviews, setReviews, cricksalId, setError, onReviewAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/cricksal/${cricksalId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews.");
      }
    };

    if (cricksalId) {
      fetchReviews();
    }
  }, [cricksalId, setReviews, setError]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to submit a review.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/create/cricksal/${cricksalId}/review`,
        { comment: newComment, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setNewComment("");
        setNewRating(1);
        setError("");
        const updatedReviews = await axios.get(`http://localhost:8000/api/cricksal/${cricksalId}/reviews`);
        setReviews(updatedReviews.data);
        onReviewAdded();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review.");
    }
  };

  return (
    <div className="bg-dark-blue text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-4 border-b border-gray-700 pb-4">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < review.rating ? "text-yellow-400" : "text-gray-500"
                    }
                  />
                ))}
              </div>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </motion.div>

      <form onSubmit={handleReviewSubmit} className="mt-6">
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white mb-4"
          placeholder="Write your review..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <div className="flex items-center mb-4">
          <label className="mr-2">Rating:</label>
          <select
            className="p-2 rounded bg-gray-800 text-white"
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Submit Review
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

Review.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      comment: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
    })
  ).isRequired,
  setReviews: PropTypes.func.isRequired,
  cricksalId: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
  onReviewAdded: PropTypes.func.isRequired,
};

export default Review;