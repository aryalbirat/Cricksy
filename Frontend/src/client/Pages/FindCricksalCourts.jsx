import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaMapMarkerAlt, FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const FindCricksalCourts = () => {
  const [cricksals, setCricksals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [sortByPrice, setSortByPrice] = useState("relevance");
  const [priceFrom, setPriceFrom] = useState(""); // Empty string for uncontrolled input initially
  const [priceTo, setPriceTo] = useState(""); // Empty string for "unlimited" initially
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch cricksals from the backend
  const fetchCricksals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/api/cricksal", {
        params: {
          searchTerm,
          location,
          sortByPrice,
          priceFrom: priceFrom || 0, // Default to 0 if empty
          priceTo: priceTo || undefined, // Treat empty as "unlimited"
        },
      });
      setCricksals(response.data.cricksals || response.data);
    } catch (error) {
      console.error("Error fetching cricksals:", error);
      setError("Failed to load cricksal courts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cricksals only on component mount (initial load)
  useEffect(() => {
    fetchCricksals();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900">
      <div className="container mx-auto max-w-screen-xl px-4 py-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find <span className="text-blue-400">Cricksal Courts</span> Near You
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover and book the best cricksal courts in your area. Filter by location, price, and more.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <motion.div 
            className="w-full lg:w-1/4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl p-5 shadow-xl">
              <div className="flex items-center mb-6">
                <FaFilter className="text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-blue-400">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search cricksal courts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                />
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Range (per hour)
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceFrom}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          setPriceFrom(value);
                        }
                      }}
                      min={0}
                      className="w-full p-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceTo}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          setPriceTo(value);
                        }
                      }}
                      min={0}
                      className="w-full p-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort by
                </label>
                <select
                  value={sortByPrice}
                  onChange={(e) => setSortByPrice(e.target.value)}
                  className="w-full p-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <motion.button
                onClick={fetchCricksals}
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-900/50 hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>

          {/* Cricksal Courts Grid */}
          <motion.div 
            className="w-full lg:w-3/4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6 bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl p-4">
              <p className="text-gray-300">
                {isLoading ? (
                  "Searching..."
                ) : error ? (
                  "Error loading results"
                ) : (
                  `Showing ${cricksals.length} results`
                )}
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center h-60">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="bg-red-900/30 border border-red-800/30 text-red-200 p-6 rounded-xl text-center">
                <p className="mb-4">{error}</p>
                <button
                  onClick={fetchCricksals}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Cricksal Cards */}
            {!isLoading && !error && (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {cricksals.length > 0 ? (
                  cricksals.map((cricksal, index) => (
                    <motion.div
                      key={cricksal._id}
                      className="bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-blue-700/20 hover:scale-105"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Image Section */}
                      <div className="w-full h-48 bg-black flex items-center justify-center relative">
                        {cricksal.images?.length > 0 ? (
                          <img
                            src={"http://localhost:8000/" + cricksal.images[0]}
                            alt={cricksal.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-900/20">
                            <span className="text-gray-400">
                              No Image Available
                            </span>
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-blue-700 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow-lg">
                          Rs{cricksal.pricePerHour || cricksal.price || "1000"}/hr
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3">
                        {/* Name */}
                        <h3 className="text-lg font-semibold text-white">
                          {cricksal.name}
                        </h3>

                        {/* Location */}
                        <p className="text-sm text-gray-300 flex items-center">
                          <FaMapMarkerAlt className="text-blue-400 mr-2" />
                          {cricksal.location || "Unknown Location"}
                        </p>

                        {/* Ratings */}
                        <div className="flex items-center text-sm text-gray-300">
                          <FaStar className="text-yellow-400 mr-1" />
                          {cricksal.avgRating ? (
                            `${cricksal.avgRating} (${cricksal.reviewCount || 0} review${cricksal.reviewCount === 1 ? "" : "s"
                            })`
                          ) : cricksal.averageRating ? (
                            `${cricksal.averageRating.toFixed(1)} (${cricksal.reviewCount || 0} review${cricksal.reviewCount === 1 ? "" : "s"
                            })`
                          ) : (
                            "No reviews yet"
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between mt-4 pt-3 border-t border-blue-900/30">
                          <button
                            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                            onClick={() => navigate(`/cricksal/${cricksal._id}`)}
                          >
                            View Details
                          </button>
                          <button
                            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/30"
                            onClick={() => navigate(`/cricksal/${cricksal._id}`)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl p-10 text-center">
                    <FaSearch className="mx-auto text-4xl text-blue-400 mb-4 opacity-60" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Cricksal Courts Found</h3>
                    <p className="text-gray-400">
                      We could not find any cricksal courts matching your criteria. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindCricksalCourts;