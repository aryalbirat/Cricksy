import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle, FaMapMarkerAlt, FaStar, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';
import { motion } from "framer-motion";

const BookArena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cricksal, setCricksal] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCricksalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/cricksal/${id}`);
        if (response.status === 200) {
          setCricksal(response.data);
        }
      } catch (error) {
        console.error("Error fetching cricksal details:", error);
      }
    };

    fetchCricksalDetails();
  }, [id]);
  const fetchAvailableSlots = async (date) => {
    setFetchingSlots(true);
    setFetchError(null);

    try {
      const response = await axios.get("http://localhost:8000/api/available-slots", {
        params: { //Use params for query parameters
          cricksalArena: id,
          bookingDate: date,
        }
      });

      setAvailableTimes(response.data.slots);
    } catch (error) {
      setFetchError("Failed to fetch available slots. Please try again.");
      console.error("Error fetching available slots:", error);
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (inputDate < today) {
      setSelectedDate(today);
      alert("You cannot select a past date.");
    } else {
      setSelectedDate(inputDate);
    }

    fetchAvailableSlots(inputDate);
    setBookingConfirmed(false);
  };
  // const handleDateChange = (e) => {
  //   const inputDate = e.target.value;
  //   const today = new Date();
  //   const currentMonth = today.getMonth();
  //   const currentYear = today.getFullYear();
  //   const selectedDateObj = new Date(inputDate);
  //   const selectedMonth = selectedDateObj.getMonth();
  //   const selectedYear = selectedDateObj.getFullYear();

  //   // Check if the selected date is in the current month
  //   if (inputDate < today.toISOString().split("T")[0] || selectedMonth !== currentMonth || selectedYear !== currentYear) {
  //     alert("Bookings are only allowed within the current month.");
  //     setSelectedDate(today.toISOString().split("T")[0]); // Reset to today's date
  //   } else {
  //     setSelectedDate(inputDate);
  //   }

  //   fetchAvailableSlots(inputDate);
  //   setBookingConfirmed(false);
  // };


  const handleRowClick = (start) => {
    const end = `${parseInt(start.split(":")[0]) + 1}:00`;
    setSelectedStartTime(start);
    setSelectedEndTime(end);
    setBookingConfirmed(false);
  };

  const calculateTotalAmount = () => {
    if (!cricksal || !selectedStartTime || !selectedEndTime) return 0;
    return cricksal.pricePerHour;
  };

  const handleBookingConfirmation = async () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      alert("Please select a date and time.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to book an arena.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const totalAmount = calculateTotalAmount();

      const response = await axios.post(
        `http://localhost:8000/api/book/${id}`,
        {
          cricksalArena: id,
          bookingDate: selectedDate,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          totalAmount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      setBookingConfirmed(true);

      // Update the available slots immediately after booking
      setAvailableTimes((prevSlots) =>
        prevSlots.map((slot) =>
          slot.startTime === selectedStartTime ? { ...slot, status: "booked" } : slot
        )
      );

      console.log(response);
      window.location.href = response.data.paymentUrl

    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Unauthorized: Please log in to proceed.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to create booking.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  if (!cricksal) {
    return <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue flex items-center justify-center">
      <div className="text-white text-xl">Loading cricksal details...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue py-6 px-4">
      <ToastContainer />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Side: Calendar and Available Schedule */}
        <div className="w-full lg:w-1/2 p-8 border-r border-white/20">
          {/* Date Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <label className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-primary" /> Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-4 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white/10 backdrop-blur-sm text-white"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </motion.div>

          {/* Time Slot Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <label className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <FaClock className="text-primary" /> Select Time Slot
            </label>
            {selectedDate && ( // Only show this section if a date is selected
              <>
                {fetchingSlots ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-white/10 backdrop-blur-sm">
                          <th className="px-4 py-2 text-left text-white">Time</th>
                          <th className="px-4 py-2 text-left text-white">Price</th>
                          <th className="px-4 py-2 text-left text-white">Pitch</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableTimes.map((slot, index) => (
                          <tr
                            key={index}
                            className="border-t border-white/20 cursor-pointer hover:bg-white/10 transition-colors text-white"
                            onClick={() => handleRowClick(slot.startTime)}
                          >
                            <td className="px-4 py-2">{slot.startTime} - {slot.endTime}</td>
                            <td className="px-4 py-2">Rs{cricksal.pricePerHour}</td>
                            <td className="px-4 py-2">
                              {slot.status === "available" ? (
                                <FaCheckCircle className="text-green-400" />
                              ) : slot.status === "booked" ? (
                                <FaTimesCircle className="text-red-400" />
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {fetchError && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 flex items-center gap-2">
                    <FaExclamationCircle className="text-red-400" />
                    {fetchError}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        {/* Right Side: Booking Details and Cart */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Cricksal Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Booking Details</h2>
            <div className="flex items-center gap-4">
              {cricksal.images?.length > 0 && (
                <img
                  src={`http://localhost:8000/${cricksal.images[0]}`}
                  alt={cricksal.name}
                  className="w-20 h-20 object-cover rounded-lg shadow-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold text-white">{cricksal.name}</h3>
                <p className="text-sm flex items-center mt-1 text-white/80">
                  <FaMapMarkerAlt className="text-primary mr-2" /> {cricksal.location || "Unknown City"}
                </p>
                <div className="flex items-center text-sm text-white/80 mt-1">
                  <FaStar className="text-yellow-400 mr-1" />
                  {cricksal.avgRating && cricksal.avgRating !== "No ratings" ? (
                    `${cricksal.avgRating} (${cricksal.reviewCount || 0} review${cricksal.reviewCount === 1 ? "" : "s"})`
                  ) : (
                    "No reviews yet"
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Selected Date and Time */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-lg font-medium text-white mb-2">Selected Slot</h3>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <p className="text-white/90">
                Date: <span className="font-semibold text-white">{selectedDate ? formatDate(selectedDate) : "Not selected"}</span>
              </p>
              <p className="text-white/90">
                Time:{" "}
                <span className="font-semibold text-white">
                  {selectedStartTime && selectedEndTime
                    ? `${selectedStartTime} - ${selectedEndTime}`
                    : "Not selected"}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Total Amount */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-medium text-white mb-2">Total Amount</h3>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <p className="text-white/90">
                <span className="font-semibold text-white text-xl">Rs{calculateTotalAmount()}</span>
              </p>
            </div>
          </motion.div>

          {/* Confirm Booking Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookingConfirmation}
            className="w-full bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Booking..." : <><FaCheckCircle /> Confirm Booking</>}
          </motion.button>

          {/* Booking Confirmation Message */}
          {bookingConfirmed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg text-green-200 flex items-center gap-2"
            >
              <FaCheckCircle className="text-green-400" />
              Booking confirmed!
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 flex items-center gap-2"
            >
              <FaExclamationCircle className="text-red-400" />
              {error}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookArena;
