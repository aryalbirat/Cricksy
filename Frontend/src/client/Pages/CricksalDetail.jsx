

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaStar, FaArrowLeft, FaPhone, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Review from "../components/Review";

const CricksalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cricksal, setCricksal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch cricksal and reviews data
  const fetchCricksalData = useCallback(async () => {
    try {
      const [cricksalResponse, reviewsResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/cricksal/${id}`),
        axios.get(`http://localhost:8000/api/cricksal/${id}/reviews`),
      ]);
      console.log("Fetched cricksal:", cricksalResponse.data); // Debug log
      console.log("Fetched reviews:", reviewsResponse.data); // Debug

      if (cricksalResponse.status === 200) setCricksal(cricksalResponse.data);
      setReviews(reviewsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCricksalData();
  }, [fetchCricksalData]);

  // Callback to handle review updates
  const handleReviewUpdate = async () => {
    await fetchCricksalData(); // Refetch cricksal data to update avgRating and reviewCount
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-xl text-dark-300 mt-4">Loading...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark-950">
        <p className="text-xl text-danger-400">{error}</p>
      </div>
    );
  if (!cricksal)
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark-950">
        <p className="text-xl text-dark-300">Cricksal not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center text-dark-300 hover:text-primary-400 mb-5 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft size={20} className="mr-2" />
          Back
        </motion.button>

        {/* Cricksal Name and Dynamic Rating */}
        <motion.div 
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            {cricksal.name}
          </h1>
          <div className="flex items-center text-dark-300 mt-2">
            <FaStar className="text-warning-400 mr-2" />
            <span>
              {cricksal.avgRating} ({cricksal.reviewCount} reviews)
            </span>
          </div>
        </motion.div>

        {/* Main Content: Image Gallery and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Large Image + Description + Reviews */}
          <motion.div 
            className="lg:col-span-3 flex flex-col gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={cricksal.images?.[0] ? `http://localhost:8000/${cricksal.images[0]}` : "/placeholder.jpg"}
              alt={`${cricksal.name} view 1`}
              className="w-full h-[415px] object-cover rounded-lg shadow-2xl"
            />
            <div className="modern-card">
              <h3 className="text-xl font-semibold text-gradient mb-4">About this Cricksal Court</h3>
              <p className="text-dark-300 text-base leading-relaxed mb-6">
                {cricksal.description || "No description available."}
              </p>
              <Review
                reviews={reviews}
                setReviews={setReviews}
                cricksalId={id}
                setError={setError}
                onReviewAdded={handleReviewUpdate} // Pass callback to Review component
              />
            </div>
          </motion.div>

          {/* Right: 2x2 Grid of Smaller Images + Sticky Contact & Location */}
          <motion.div 
            className="lg:col-span-2 flex flex-col gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={cricksal.images?.[i] ? `http://localhost:8000/${cricksal.images[i]}` : "/placeholder.jpg"}
                  alt={`${cricksal.name} view ${i + 1}`}
                  className="w-full h-[200px] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              ))}
            </div>

            {/* Sticky Contact & Location Card */}
            <div className="modern-card sticky top-6">
              <h3 className="text-lg font-semibold text-gradient mb-4">Contact & Location</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-300 font-medium text-sm">Address</p>
                    <p className="text-dark-400 text-sm leading-relaxed">
                      {cricksal.location || "Pokhara, Mahendrapool"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaPhone className="text-success-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-300 font-medium text-sm">Phone</p>
                    <p className="text-dark-400 text-sm">{cricksal.createdBy.phoneNumber || "+977 123-456-7890"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaEnvelope className="text-danger-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-300 font-medium text-sm">Email</p>
                    <p className="text-dark-400 text-sm">{cricksal.createdBy.Email || "contact@cricksal.com"}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-dark-300 font-medium text-sm">Pricing</p>
                  <p className="text-gradient text-lg font-semibold">
                    Rs{cricksal.pricePerHour || "1000"}
                    <span className="text-dark-400 text-sm">/hr</span>
                  </p>
                </div>
                <button
                  className="w-full btn-primary py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/book/${id}`)}
                >
                  Book Now
                </button>
                <p className="text-dark-400 text-xs text-center mt-2">Secure your slot instantly!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CricksalDetail;