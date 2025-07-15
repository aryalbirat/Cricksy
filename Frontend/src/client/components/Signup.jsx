import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import cricksalimage from "../../image/4.jpg"; 
import { ToastContainer, toast } from 'react-toastify';
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaUserShield } from "react-icons/fa";
import { API_BASE_URL } from "../../config/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    Email: "",
    password: "",
    ConfirmPassword: "",
    FirstName: "",
    LastName: "",
    address: "",
    phoneNumber: "",
    role: "", 
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.ConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Validate role selection
    if (!formData.role) {
      setErrorMessage("Please select a role.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/signup`, {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        password: formData.password,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      if (response.status === 200) {
        toast.success("Signup successful! Please Login");

        setFormData({
          Email: "",
          password: "",
          ConfirmPassword: "",
          FirstName: "",
          LastName: "",
          address: "",
          phoneNumber: "",
          role: "",
        });
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage("Email already exists");
      } else if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        if (firstError.params === "FirstName" || firstError.params === "LastName") {
          setErrorMessage("Names must be at least 3 characters");
        } else if (firstError.params === "password") {
          setErrorMessage("Password must be at least 8 characters");
        } else if (firstError.params === "Email") {
          setErrorMessage("Please enter a valid email address.");
        } else if (firstError.params === "phoneNumber") {
          setErrorMessage("Phone number is already in use.");
        } else if (firstError.params === "role") {
          setErrorMessage("Invalid role selected.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } else {
        setErrorMessage(error.response?.data?.msg || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 flex items-center justify-center p-4">
      <ToastContainer/>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-900/30 flex flex-col md:flex-row overflow-hidden"
        >
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-blue-400 mb-2">Join the Community</h2>
              <p className="text-gray-300">Create your account to get started</p>
            </motion.div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-900/30 border border-red-800/30 text-red-300 p-4 rounded-lg mb-6"
              >
                {errorMessage}
              </motion.div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <label htmlFor="firstName" className="block text-gray-300 text-sm mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      type="text"
                      id="firstName"
                      value={formData.FirstName}
                      onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <label htmlFor="lastName" className="block text-gray-300 text-sm mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      type="text"
                      id="lastName"
                      value={formData.LastName}
                      onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative"
                >
                  <label htmlFor="email" className="block text-gray-300 text-sm mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.Email}
                      onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative"
                >
                  <label htmlFor="phoneNumber" className="block text-gray-300 text-sm mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      type="text"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative"
              >
                <label htmlFor="address" className="block text-gray-300 text-sm mb-2">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="relative"
              >
                <label className="block text-gray-300 text-sm mb-2">Select Role</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                    <span className="flex items-center gap-1">
                      <FaUser className="text-blue-400" /> User
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="radio"
                      name="role"
                      value="owner"
                      checked={formData.role === "owner"}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                    <span className="flex items-center gap-1">
                      <FaUserShield className="text-blue-400" /> Owner
                    </span>
                  </label>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="relative"
                >
                  <label htmlFor="password" className="block text-gray-300 text-sm mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="relative"
                >
                  <label htmlFor="confirmPassword" className="block text-gray-300 text-sm mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.ConfirmPassword}
                      onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-900/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing Up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </motion.button>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-8 text-center text-gray-400"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </motion.p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 relative hidden md:block">
            <img
              src={cricksalimage}
              alt="Cricksal Background"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 flex items-end justify-center pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center px-8"
              >
                <h3 className="text-blue-400 text-2xl font-bold mb-3">Join the Cricksal Community Today</h3>
                <p className="text-gray-300 text-sm font-medium">Connect with players and venues near you</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;