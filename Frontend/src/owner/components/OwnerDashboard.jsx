// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaFutbol, FaMoneyBillWave, FaStar, FaCalendarCheck } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const OwnerDashboard = () => {
//   const [dashboardData, setDashboardData] = useState({
//     bookings: [],
//     payments: [],
//     reviews: [],
//     cricksals: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token'); // Assuming token-based auth
//         const config = { headers: { Authorization: `Bearer ${token}` } };

//         // Fetch owner's bookings, payments, reviews, and cricksals
//         const [bookingsRes, paymentsRes, reviewsRes, cricksalsRes] = await Promise.all([
//           axios.get('http://localhost:8000/api/owner/bookings', config),
//           axios.get('http://localhost:8000/api/owner/payment/arena', config),
//           axios.get('http://localhost:8000/api/owner/reviews', config),
//           axios.get('http://localhost:8000/api/cricksals/owner', config),
//         ]);

//         console.log('Bookings:', bookingsRes.data);
// console.log('Payments:', paymentsRes.data);
// console.log('Reviews:', reviewsRes.data);
// console.log('Cricksals:', cricksalsRes.data);


//         setDashboardData({
//           bookings: bookingsRes.data.bookings || [],
//           payments: paymentsRes.data || [],
//           reviews: reviewsRes.data.reviews || [],
//   cricksals: cricksalsRes.data.cricksals || [], 
//         });
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err.message);
//         setError('Failed to load dashboard data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) return <div className="text-center py-10">Loading...</div>;
//   if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

//   const { bookings, payments, reviews, cricksals } = dashboardData;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-teal-600 mb-8">Owner Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaCalendarCheck className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Total Bookings</h2>
//             <p className="text-2xl font-bold text-teal-600">{bookings.length}</p>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaMoneyBillWave className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Total Payments</h2>
//             <p className="text-2xl font-bold text-teal-600">NPR {payments.reduce((sum, p) => sum + p.amount, 0)}</p>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaStar className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Total Reviews</h2>
//             <p className="text-2xl font-bold text-teal-600">{reviews.length}</p>
          
            
//           </div>
          
          
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaFutbol className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Cricksal Arenas</h2>
//             <p className="text-2xl font-bold text-teal-600">{cricksals.length}</p>
//           </div>
//         </div>
//       </div>

//       {/* Recent Bookings Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h2>
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-teal-50">
//               <th className="px-4 py-2 text-left">User</th>
//               <th className="px-4 py-2 text-left">Cricksal</th>
//               <th className="px-4 py-2 text-left">Date</th>
//               <th className="px-4 py-2 text-left">Time</th>
//               <th className="px-4 py-2 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.slice(0, 5).map((booking) => (
//               <tr key={booking._id} className="border-b">
//                 <td className="px-4 py-2">{booking.user?.FirstName} {booking.user?.LastName}</td>
//                 <td className="px-4 py-2">{booking.cricksalArena?.name}</td>
//                 <td className="px-4 py-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
//                 <td className="px-4 py-2">{booking.startTime} - {booking.endTime}</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 rounded ${
//                     booking.status === 'completed' ? 'bg-green-100 text-green-700' : 
//                     booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
//                     'bg-blue-100 text-blue-700'
//                   }`}>
//                     {booking.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button
//           onClick={() => navigate('/owner/bookings')}
//           className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
//         >
//           View All Bookings
//         </button>
//       </div>

//       {/* Recent Payments Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Payments</h2>
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-teal-50">
//               <th className="px-4 py-2 text-left">User</th>
//               <th className="px-4 py-2 text-left">Amount</th>
//               <th className="px-4 py-2 text-left">Date</th>
//               <th className="px-4 py-2 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.slice(0, 5).map((payment) => (
//               <tr key={payment._id} className="border-b">
//                 <td className="px-4 py-2">{payment.userId?.FirstName} {payment.userId?.LastName}</td>
//                 <td className="px-4 py-2">NPR {payment.amount}</td>
//                 <td className="px-4 py-2">{new Date(payment.paymentDate).toLocaleDateString()}</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 rounded ${
//                     payment.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 
//                     'bg-red-100 text-red-700'
//                   }`}>
//                     {payment.paymentStatus}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button
//           onClick={() => navigate('/owner/payments')}
//           className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
//         >
//           View All Payments
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OwnerDashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFutbol, FaMoneyBillWave, FaStar, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    payments: [],
    reviews: [],
    cricksals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log('Fetching data from endpoints:');
        console.log('Bookings: http://localhost:8000/api/owner/bookings');
        console.log('Payments: http://localhost:8000/api/owner/payment/arena');
        console.log('Reviews: http://localhost:8000/api/owner/reviews');
        console.log('Cricksals: http://localhost:8000/api/cricksals/owner');

        // Fetch data with fallbacks for all endpoints
        const [bookingsRes, paymentsRes, reviewsRes, cricksalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/owner/bookings', config).catch((err) => {
            console.warn('Bookings endpoint failed:', err.message);
            return { data: { bookings: [] } };
          }),
          axios.get('http://localhost:8000/api/owner/payment/arena', config).catch((err) => {
            console.warn('Payments endpoint failed:', err.message);
            return { data: { payments: [] }  };
          }),
          axios.get('http://localhost:8000/api/owner/reviews', config).catch((err) => {
            console.warn('Reviews endpoint failed:', err.message);
            return { data: { reviews: [] } };
          }),
          axios.get('http://localhost:8000/api/cricksals/owner', config).catch((err) => {
            console.warn('Cricksals endpoint failed:', err.message);
            return { data: { cricksals: [] } };
          }),
        ]);

        console.log('Bookings Response:', bookingsRes.data);
        console.log('Payments Response:', paymentsRes.data);
        console.log('Reviews Response:', reviewsRes.data);
        console.log('Cricksals Response:', cricksalsRes.data);

        // Set dashboard data with strict validation
        setDashboardData({
          bookings: Array.isArray(bookingsRes.data.bookings) ? bookingsRes.data.bookings : [],
          payments: Array.isArray(paymentsRes.data.payments) ? paymentsRes.data.payments : [],
          reviews: Array.isArray(reviewsRes.data.reviews) ? reviewsRes.data.reviews : [],
          cricksals: Array.isArray(cricksalsRes.data.cricksals) ? cricksalsRes.data.cricksals : [],
        });
      } catch (err) {
        console.error('Critical error fetching dashboard data:', err.message);
        setError(err.message || 'Failed to fetch dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
  if (error) return <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue flex items-center justify-center"><div className="text-red-400 text-xl text-center p-4">{error}</div></div>;

  const { bookings, payments, reviews, cricksals } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-8">Owner Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 flex items-center space-x-4"
          >
            <FaCalendarCheck className="text-primary text-3xl" />
            <div>
              <h2 className="text-lg font-semibold text-white/90">Total Bookings</h2>
              <p className="text-2xl font-bold text-white">{bookings.length}</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 flex items-center space-x-4"
          >
            <FaMoneyBillWave className="text-primary text-3xl" />
            <div>
              <h2 className="text-lg font-semibold text-white/90">Total Payments</h2>
              <p className="text-2xl font-bold text-white">NPR {payments.reduce((sum, p) => sum + (p.amount || 0), 0)}</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 flex items-center space-x-4"
          >
            <FaStar className="text-primary text-3xl" />
            <div>
              <h2 className="text-lg font-semibold text-white/90">Total Reviews</h2>
              <p className="text-2xl font-bold text-white">{reviews.length}</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 flex items-center space-x-4"
          >
            <FaFutbol className="text-primary text-3xl" />
            <div>
              <h2 className="text-lg font-semibold text-white/90">Cricksal Arenas</h2>
              <p className="text-2xl font-bold text-white">{cricksals.length}</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Recent Bookings</h2>
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-white/10 backdrop-blur-sm">
                    <th className="px-4 py-2 text-left text-white">User</th>
                    <th className="px-4 py-2 text-left text-white">Cricksal</th>
                    <th className="px-4 py-2 text-left text-white">Date</th>
                    <th className="px-4 py-2 text-left text-white">Time</th>
                    <th className="px-4 py-2 text-left text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id} className="border-b border-white/20 text-white">
                      <td className="px-4 py-2">{booking.user?.FirstName || 'N/A'} {booking.user?.LastName || ''}</td>
                      <td className="px-4 py-2">{booking.cricksalArena?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-2">{booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded ${
                            booking.status === 'completed'
                              ? 'bg-green-500/20 text-green-200'
                              : booking.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-200'
                              : 'bg-blue-500/20 text-blue-200'
                          }`}
                        >
                          {booking.status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-white/60">No bookings yet</p>
          )}
          <button
            onClick={() => navigate('/owner/bookings')}
            className="mt-4 text-primary hover:text-primary/80 font-semibold"
          >
            View All Bookings
          </button>
        </motion.div>

        {/* Recent Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Recent Payments</h2>
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-white/10 backdrop-blur-sm">
                    <th className="px-4 py-2 text-left text-white">User</th>
                    <th className="px-4 py-2 text-left text-white">Amount</th>
                    <th className="px-4 py-2 text-left text-white">Date</th>
                    <th className="px-4 py-2 text-left text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 5).map((payment) => (
                    <tr key={payment._id} className="border-b border-white/20 text-white">
                      <td className="px-4 py-2">{payment.userId?.FirstName || 'N/A'} {payment.userId?.LastName || ''}</td>
                      <td className="px-4 py-2">NPR {payment.amount || 0}</td>
                      <td className="px-4 py-2">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded ${
                            payment.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                          }`}
                        >
                          {payment.paymentStatus || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-white/60">No payments yet</p>
          )}
          <button
            onClick={() => navigate('/owner/payments')}
            className="mt-4 text-primary hover:text-primary/80 font-semibold"
          >
            View All Payments
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OwnerDashboard;
