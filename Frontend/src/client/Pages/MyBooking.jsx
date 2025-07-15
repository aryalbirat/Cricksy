import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const MyBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState({
    completed: [],
    current: [],
    upcoming: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/booking", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.patch(`http://localhost:8000/api/booking/cancel/${bookingId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBookings((prev) => ({
        ...prev,
        upcoming: prev.upcoming.filter((b) => b._id !== bookingId),
      }));
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const renderBookingCard = (booking) => (
    <motion.div
      key={booking._id}
      className="modern-card transform hover:scale-[1.02] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cricksal Image */}
        <div className="md:w-1/3">
          <img
            src={
              booking.cricksalArena?.images?.[0]
                ? `http://localhost:8000/${booking.cricksalArena.images[0]}`
                : "/default-cricksal.jpg"
            }
            alt={booking.cricksalArena?.name || "Cricksal Arena"}
            className="w-full h-48 md:h-full object-cover rounded-lg"
          />
        </div>

        {/* Booking Details */}
        <div className="md:w-2/3 flex-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gradient">
              {booking.cricksalArena?.name || "Unknown Arena"}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'completed' ? 'bg-success-500/20 text-success-300' :
              booking.status === 'current' ? 'bg-primary-500/20 text-primary-300' :
              'bg-accent-500/20 text-accent-300'
            }`}>
              {booking.status || selectedCategory}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1 text-lg" />
                <div>
                  <p className="font-medium text-dark-300">Location</p>
                  <p className="text-dark-200">
                    {booking.cricksalArena?.location || "No location available"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-accent-400 mt-1 text-lg" />
                <div>
                  <p className="font-medium text-dark-300">Date</p>
                  <p className="text-dark-200">
                    {formatDate(booking.bookingDate)}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaClock className="text-warning-400 mt-1 text-lg" />
                <div>
                  <p className="font-medium text-dark-300">Time</p>
                  <p className="text-dark-200">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaDollarSign className="text-success-400 mt-1 text-lg" />
                <div>
                  <p className="font-medium text-dark-300">Total</p>
                  <p className="text-success-400 font-semibold text-xl">
                    Rs {booking.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel button only for upcoming bookings */}
          {selectedCategory === "upcoming" && (
            <div className="mt-6 text-right">
              <button
                onClick={() => handleCancel(booking._id)}
                className="px-5 py-2 text-white bg-danger-500 hover:bg-danger-600 rounded-lg font-medium transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-dark-950 py-8">
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-3">
        <motion.h1 
          className="font-bold text-3xl text-gradient bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Bookings
        </motion.h1>

        <div className="flex justify-center mb-8">
          {["upcoming", "current", "completed"].map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 mx-2 rounded-lg font-medium text-lg transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg"
                  : "bg-dark-800/50 text-dark-300 hover:bg-dark-700/50 hover:text-primary-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-dark-400 animate-pulse">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2">Loading bookings...</p>
          </div>
        ) : bookings[selectedCategory].length > 0 ? (
          <motion.div 
            className="grid gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {bookings[selectedCategory].map((booking) =>
              renderBookingCard(booking)
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 modern-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-dark-400 text-lg mb-4">
              No {selectedCategory} bookings found.
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary"
            >
              Book Now →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
