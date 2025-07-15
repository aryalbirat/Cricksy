// import { useState, useEffect } from "react";
// import { FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle, FaMapMarkerAlt, FaStar, FaTimesCircle } from "react-icons/fa";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
// import { format } from 'date-fns';
// import { motion } from "framer-motion";

// const BookArena = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedStartTime, setSelectedStartTime] = useState("");
//   const [selectedEndTime, setSelectedEndTime] = useState("");
//   const [bookingConfirmed, setBookingConfirmed] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [cricksal, setCricksal] = useState(null);
//   const [availableTimes, setAvailableTimes] = useState([]);
//   const [fetchingSlots, setFetchingSlots] = useState(false);
//   const [fetchError, setFetchError] = useState(null);

//   useEffect(() => {
//     const fetchCricksalDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/cricksal/${id}`);
//         if (response.status === 200) {
//           setCricksal(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching cricksal details:", error);
//       }
//     };

//     fetchCricksalDetails();
//   }, [id]);
//   const fetchAvailableSlots = async (date) => {
//     setFetchingSlots(true);
//     setFetchError(null);

//     try {
//       const response = await axios.get("http://localhost:8000/api/available-slots", {
//         params: { //Use params for query parameters
//           cricksalArena: id,
//           bookingDate: date,
//         }
//       });

//       setAvailableTimes(response.data.slots);
//     } catch (error) {
//       setFetchError("Failed to fetch available slots. Please try again.");
//       console.error("Error fetching available slots:", error);
//     } finally {
//       setFetchingSlots(false);
//     }
//   };

//   const handleDateChange = (e) => {
//     const inputDate = e.target.value;
//     const today = new Date().toISOString().split("T")[0];

//     if (inputDate < today) {
//       setSelectedDate(today);
//       alert("You cannot select a past date.");
//     } else {
//       setSelectedDate(inputDate);
//     }

//     fetchAvailableSlots(inputDate);
//     setBookingConfirmed(false);
//   };


//   const handleRowClick = (start) => {
//     const end = `${parseInt(start.split(":")[0]) + 1}:00`;
//     setSelectedStartTime(start);
//     setSelectedEndTime(end);
//     setBookingConfirmed(false);
//   };

//   const calculateTotalAmount = () => {
//     if (!cricksal || !selectedStartTime || !selectedEndTime) return 0;
//     return cricksal.pricePerHour;
//   };

//   const handleBookingConfirmation = async () => {
//     if (!selectedDate || !selectedStartTime || !selectedEndTime) {
//       alert("Please select a date and time.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("You must be logged in to book an arena.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const totalAmount = calculateTotalAmount();

//       const response = await axios.post(
//         `http://localhost:8000/api/book/${id}`,
//         {
//           cricksalArena: id,
//           bookingDate: selectedDate,
//           startTime: selectedStartTime,
//           endTime: selectedEndTime,
//           totalAmount: totalAmount,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

      
//       setBookingConfirmed(true);

//       // Update the available slots immediately after booking
//       setAvailableTimes((prevSlots) =>
//         prevSlots.map((slot) =>
//           slot.startTime === selectedStartTime ? { ...slot, status: "booked" } : slot
//         )
//       );

//       console.log(response);
//       alert('Booking confirmed successfully!');
//       navigate('/my-bookings');

//     } catch (err) {
//       if (err.response?.status === 400) {
//         setError(err.response.data.message);
//       } else if (err.response?.status === 401) {
//         setError("Unauthorized: Please log in to proceed.");
//         localStorage.removeItem("token");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setError("Failed to create booking.");
//       }
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   const formatDate = (dateString) => {
//     return format(new Date(dateString), "dd/MM/yyyy");
//   };

//   if (!cricksal) {
//     return <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue flex items-center justify-center">
//       <div className="text-white text-xl">Loading cricksal details...</div>
//     </div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue py-6 px-4">
//       <ToastContainer />
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-6xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col lg:flex-row"
//       >
//         {/* Left Side: Calendar and Available Schedule */}
//         <div className="w-full lg:w-1/2 p-8 border-r border-white/20">
//           {/* Date Selection */}
//           <motion.div 
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="mb-8"
//           >
//             <label className="text-lg font-medium text-white mb-3 flex items-center gap-2">
//               <FaCalendarAlt className="text-primary" /> Select Date
//             </label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className="w-full px-4 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white/10 backdrop-blur-sm text-white"
//               min={new Date().toISOString().split("T")[0]}
//               required
//             />
//           </motion.div>

//           {/* Time Slot Selection */}
//           <motion.div 
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="mb-8"
//           >
//             <label className="text-lg font-medium text-white mb-3 flex items-center gap-2">
//               <FaClock className="text-primary" /> Select Time Slot
//             </label>
//             {selectedDate && ( // Only show this section if a date is selected
//               <>
//                 {fetchingSlots ? (
//                   <div className="flex justify-center items-center py-4">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full table-auto border-collapse">
//                       <thead>
//                         <tr className="bg-white/10 backdrop-blur-sm">
//                           <th className="px-4 py-2 text-left text-white">Time</th>
//                           <th className="px-4 py-2 text-left text-white">Price</th>
//                           <th className="px-4 py-2 text-left text-white">Pitch</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {availableTimes.map((slot, index) => (
//                           <tr
//                             key={index}
//                             className="border-t border-white/20 cursor-pointer hover:bg-white/10 transition-colors text-white"
//                             onClick={() => handleRowClick(slot.startTime)}
//                           >
//                             <td className="px-4 py-2">{slot.startTime} - {slot.endTime}</td>
//                             <td className="px-4 py-2">Rs{cricksal.pricePerHour}</td>
//                             <td className="px-4 py-2">
//                               {slot.status === "available" ? (
//                                 <FaCheckCircle className="text-green-400" />
//                               ) : slot.status === "booked" ? (
//                                 <FaTimesCircle className="text-red-400" />
//                               ) : (
//                                 <span className="text-gray-400">-</span>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//                 {fetchError && (
//                   <div className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 flex items-center gap-2">
//                     <FaExclamationCircle className="text-red-400" />
//                     {fetchError}
//                   </div>
//                 )}
//               </>
//             )}
//           </motion.div>
//         </div>

//         {/* Right Side: Booking Details and Cart */}
//         <div className="w-full lg:w-1/2 p-8">
//           {/* Cricksal Details */}
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="mb-8"
//           >
//             <h2 className="text-2xl font-bold mb-4 text-white">Booking Details</h2>
//             <div className="flex items-center gap-4">
//               {cricksal.images?.length > 0 && (
//                 <img
//                   src={`http://localhost:8000/${cricksal.images[0]}`}
//                   alt={cricksal.name}
//                   className="w-20 h-20 object-cover rounded-lg shadow-lg"
//                 />
//               )}
//               <div>
//                 <h3 className="text-xl font-semibold text-white">{cricksal.name}</h3>
//                 <p className="text-sm flex items-center mt-1 text-white/80">
//                   <FaMapMarkerAlt className="text-primary mr-2" /> {cricksal.location || "Unknown City"}
//                 </p>
//                 <div className="flex items-center text-sm text-white/80 mt-1">
//                   <FaStar className="text-yellow-400 mr-1" />
//                   {cricksal.avgRating && cricksal.avgRating !== "No ratings" ? (
//                     `${cricksal.avgRating} (${cricksal.reviewCount || 0} review${cricksal.reviewCount === 1 ? "" : "s"})`
//                   ) : (
//                     "No reviews yet"
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Selected Date and Time */}
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="mb-8"
//           >
//             <h3 className="text-lg font-medium text-white mb-2">Selected Slot</h3>
//             <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
//               <p className="text-white/90">
//                 Date: <span className="font-semibold text-white">{selectedDate ? formatDate(selectedDate) : "Not selected"}</span>
//               </p>
//               <p className="text-white/90">
//                 Time:{" "}
//                 <span className="font-semibold text-white">
//                   {selectedStartTime && selectedEndTime
//                     ? `${selectedStartTime} - ${selectedEndTime}`
//                     : "Not selected"}
//                 </span>
//               </p>
//             </div>
//           </motion.div>

//           {/* Total Amount */}
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="mb-8"
//           >
//             <h3 className="text-lg font-medium text-white mb-2">Total Amount</h3>
//             <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
//               <p className="text-white/90">
//                 <span className="font-semibold text-white text-xl">Rs{calculateTotalAmount()}</span>
//               </p>
//             </div>
//           </motion.div>

//           {/* Confirm Booking Button */}
//           <motion.button
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleBookingConfirmation}
//             className="w-full bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
//             disabled={loading}
//           >
//             {loading ? "Booking..." : <><FaCheckCircle /> Confirm Booking</>}
//           </motion.button>

//           {/* Booking Confirmation Message */}
//           {bookingConfirmed && (
//             <motion.div 
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg text-green-200 flex items-center gap-2"
//             >
//               <FaCheckCircle className="text-green-400" />
//               Booking confirmed!
//             </motion.div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <motion.div 
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 flex items-center gap-2"
//             >
//               <FaExclamationCircle className="text-red-400" />
//               {error}
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default BookArena;




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
        params: {
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
      toast.error("You cannot select a past date.");
    } else {
      setSelectedDate(inputDate);
    }

    fetchAvailableSlots(inputDate);
    setBookingConfirmed(false);
  };

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
      toast.error("Please select a date and time.");
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
      toast.success('Booking confirmed successfully!');
      
      setTimeout(() => {
        navigate('/mybooking');
      }, 2000);

    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Unauthorized: Please log in to proceed.");
        toast.error("Unauthorized: Please log in to proceed.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to create booking.");
        toast.error("Failed to create booking.");
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading cricksal details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-900/30 flex flex-col lg:flex-row overflow-hidden"
        >
          {/* Left Side: Calendar and Available Schedule */}
          <div className="w-full lg:w-1/2 p-8 border-r border-blue-900/30">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-blue-400 mb-2">Book Your Slot</h2>
              <p className="text-gray-300">Select your preferred date and time</p>
            </motion.div>

            {/* Date Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <label className="block text-gray-300 text-sm mb-2">
                <FaCalendarAlt className="inline mr-2 text-blue-400" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full px-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </motion.div>

            {/* Time Slot Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <label className="block text-gray-300 text-sm mb-2">
                <FaClock className="inline mr-2 text-blue-400" />
                Available Time Slots
              </label>
              
              {selectedDate && (
                <>
                  {fetchingSlots ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="bg-black/30 rounded-lg border border-blue-900/50 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-blue-900/30 text-blue-400">
                              <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {availableTimes.map((slot, index) => (
                              <tr
                                key={index}
                                className={`border-t border-blue-900/30 cursor-pointer hover:bg-blue-900/20 transition-colors ${
                                  selectedStartTime === slot.startTime ? 'bg-blue-900/40' : ''
                                }`}
                                onClick={() => slot.status === "available" && handleRowClick(slot.startTime)}
                              >
                                <td className="px-4 py-3 text-gray-300">
                                  {slot.startTime} - {slot.endTime}
                                </td>
                                <td className="px-4 py-3 text-gray-300">
                                  Rs{cricksal.pricePerHour}
                                </td>
                                <td className="px-4 py-3">
                                  {slot.status === "available" ? (
                                    <FaCheckCircle className="text-green-400" />
                                  ) : (
                                    <FaTimesCircle className="text-red-400" />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {fetchError && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mt-4 bg-red-900/30 border border-red-800/30 text-red-300 p-4 rounded-lg"
                    >
                      <FaExclamationCircle className="inline mr-2" />
                      {fetchError}
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>

          {/* Right Side: Booking Details */}
          <div className="w-full lg:w-1/2 p-8">
            {/* Cricksal Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Booking Details</h3>
              <div className="bg-black/30 rounded-lg border border-blue-900/50 p-6">
                <div className="flex items-center gap-4 mb-4">
                  {cricksal.images?.length > 0 && (
                    <img
                      src={`http://localhost:8000/${cricksal.images[0]}`}
                      alt={cricksal.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="text-xl font-semibold text-white">{cricksal.name}</h4>
                    <p className="text-gray-300 flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-2 text-blue-400" />
                      {cricksal.location || "Unknown City"}
                    </p>
                    <div className="flex items-center text-sm text-gray-300 mt-1">
                      <FaStar className="text-yellow-400 mr-1" />
                      {cricksal.avgRating && cricksal.avgRating !== "No ratings" ? (
                        `${cricksal.avgRating} (${cricksal.reviewCount || 0} reviews)`
                      ) : (
                        "No reviews yet"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Selected Slot Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <h4 className="text-lg font-medium text-gray-300 mb-3">Selected Slot</h4>
              <div className="bg-black/30 rounded-lg border border-blue-900/50 p-4 space-y-2">
                <p className="text-gray-300">
                  <span className="text-blue-400">Date:</span>{" "}
                  <span className="text-white font-medium">
                    {selectedDate ? formatDate(selectedDate) : "Not selected"}
                  </span>
                </p>
                <p className="text-gray-300">
                  <span className="text-blue-400">Time:</span>{" "}
                  <span className="text-white font-medium">
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
              <h4 className="text-lg font-medium text-gray-300 mb-3">Total Amount</h4>
              <div className="bg-black/30 rounded-lg border border-blue-900/50 p-4">
                <p className="text-2xl font-bold text-blue-400">
                  Rs{calculateTotalAmount()}
                </p>
              </div>
            </motion.div>

            {/* Confirm Booking Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookingConfirmation}
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-900/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading || !selectedDate || !selectedStartTime}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </span>
              ) : (
                <>
                  <FaCheckCircle />
                  Confirm Booking
                </>
              )}
            </motion.button>

            {/* Success Message */}
            {bookingConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-green-900/30 border border-green-800/30 text-green-300 p-4 rounded-lg flex items-center gap-2"
              >
                <FaCheckCircle className="text-green-400" />
                Booking confirmed successfully! Redirecting to your bookings...
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-red-900/30 border border-red-800/30 text-red-300 p-4 rounded-lg flex items-center gap-2"
              >
                <FaExclamationCircle className="text-red-400" />
                {error}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookArena;