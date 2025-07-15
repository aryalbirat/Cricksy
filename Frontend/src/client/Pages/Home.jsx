import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaStar, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
// import Footer from "../components/Footer";
import Hero from "../components/Hero";

const Home = () => {
  const [cricksals, setCricksals] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCricksals = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/cricksal");
        if (response.status === 200) {
          setCricksals(response.data.cricksals);
        }
      } catch (error) {
        console.error("Error fetching cricksals:", error);
      }
    };

    fetchCricksals();
  }, []);

  return (
 <div className="bg-gradient-to-r from-black from-10% via-slate-950 via-50% to-blue-950 to-100% min-h-screen">
      <Hero />
      
      {/* Featured Cricksals */}
      <div className="container mx-auto max-w-screen-xl px-3 lg:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Featured{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
              Courts
            </span>
          </motion.h2>
          <motion.p 
            className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover premium cricksal courts in your area with world-class facilities and instant booking.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cricksals.length > 0 ? (
            cricksals.map((cricksal, index) => (
              <motion.div
                key={cricksal._id}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:bg-slate-800/60 hover:border-blue-600/30 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-blue-900/20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => navigate(`/cricksal/${cricksal._id}`)}
              >
                {/* Image Section */}
                <div className="relative w-full h-56 bg-slate-800 overflow-hidden">
                  {cricksal.images?.length > 0 ? (
                    <img
                      src={"http://localhost:8000/" + cricksal.images[0]}
                      alt={cricksal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <span className="text-slate-500 text-sm font-medium">No Image Available</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-blue-500/30">
                      Rs {cricksal.pricePerHour || "1000"}/hr
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <motion.button
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg border border-blue-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaEye className="text-lg" /> View Details
                    </motion.button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Name & Location */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                      {cricksal.name}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center">
                      <FaMapMarkerAlt className="text-blue-400 mr-2" /> 
                      {cricksal.location || "Unknown City"}
                    </p>
                  </div>

                  {/* Ratings & Reviews */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-slate-400">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.5</span>
                      <span className="text-slate-600 ml-1">(120 reviews)</span>
                    </div>
                    <motion.button
                      className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1"
                      whileHover={{ scale: 1.05, x: 5 }}
                      transition={{ duration: 0.2 }}
                       onClick={() => navigate(`/cricksal/${cricksal._id}`)}
                    >
                      Book Now →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-slate-500 space-y-6"
              >
                <div className="text-6xl mb-4">🏟️</div>
                <p className="text-xl mb-6">No cricksal courts available at the moment.</p>
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg border border-blue-500/30"
                  onClick={() => navigate("/findcricksalcourts")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Courts
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>

        {/* View All Button */}
        {cricksals.length > 0 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              className="bg-transparent border-2 border-blue-500/60 text-blue-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-800/20 hover:text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm"
              onClick={() => navigate("/findcricksalcourts")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Courts
            </motion.button>
          </motion.div>
        )}
      </div>
      
      {/* <Footer /> */}
    </div>
  );
};

export default Home;