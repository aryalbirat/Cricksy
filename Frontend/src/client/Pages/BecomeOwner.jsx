import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/user/userSlice"; // Redux action to update user state
import { motion } from "framer-motion";
import { FaUser, FaMapMarkerAlt, FaPhone, FaCrown } from "react-icons/fa";

const BecomeOwner = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    location: "",
    contactInfo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to become an owner.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/become-owner",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Full Response Data:", response.data); // Debugging log
  
      if (response.status === 200) {
        alert("Congratulations! You are now an owner.");
        
        const { updatedUser, token: newToken } = response.data;
  
        if (!updatedUser) {
          throw new Error("User data not received from server.");
        }
  
        // Update Redux state with updated user data
        dispatch(setUser(updatedUser));
  
        // Store new token
        if (newToken) {
          localStorage.setItem("token", newToken);
        }
  
        // Navigate to the profile page for review or edit after becoming an owner
        navigate("/owner");
      }
    } catch (error) {
      console.error("Error in BecomeOwner:", error);
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 max-w-lg w-full bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <FaCrown className="text-6xl text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Become an Owner</h2>
          <p className="text-white/80 mt-2">Start your journey as a cricksal court owner</p>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 mb-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-center"
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <input
              type="text"
              placeholder="Owner Name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/60"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/60"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/60"
              required
            />
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default BecomeOwner;
