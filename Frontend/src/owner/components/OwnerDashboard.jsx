import { useState, useEffect } from 'react';
import { API_BASE_URL } from "../../config/api";
import axios from 'axios';
import { FaFutbol, FaStar, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
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
        if (!token) throw new Error('No authentication token found. Please log in.');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [bookingsRes, reviewsRes, cricksalsRes] = await Promise.all([
          axios.get('${API_BASE_URL}/api/owner/bookings', config).catch(() => ({ data: { bookings: [] } })),
          axios.get('${API_BASE_URL}/api/owner/reviews', config).catch(() => ({ data: { reviews: [] } })),
          axios.get('${API_BASE_URL}/api/cricksals/owner', config).catch(() => ({ data: { cricksals: [] } })),
        ]);

        setDashboardData({
          bookings: Array.isArray(bookingsRes.data.bookings) ? bookingsRes.data.bookings : [],
          reviews: Array.isArray(reviewsRes.data.reviews) ? reviewsRes.data.reviews : [],
          cricksals: Array.isArray(cricksalsRes.data.cricksals) ? cricksalsRes.data.cricksals : [],
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 flex items-center justify-center">
        <div className="text-red-400 text-xl text-center p-4">{error}</div>
      </div>
    );

  const { bookings, reviews, cricksals } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold text-blue-400 mb-8">Owner Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[{
            icon: <FaCalendarCheck className="text-blue-400 text-3xl" />,
            label: 'Total Bookings',
            value: bookings.length
          }, {
            icon: <FaStar className="text-blue-400 text-3xl" />,
            label: 'Total Reviews',
            value: reviews.length
          }, {
            icon: <FaFutbol className="text-blue-400 text-3xl" />,
            label: 'Cricksal Arenas',
            value: cricksals.length
          }].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
              className="bg-black/40 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-blue-900/50 flex items-center space-x-4"
            >
              {card.icon}
              <div>
                <h2 className="text-lg font-semibold text-white/90">{card.label}</h2>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-black/40 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-blue-900/50"
        >
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Recent Bookings</h2>
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-black/40 text-blue-400">
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Cricksal</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id} className="border-b border-blue-900/40 text-white">
                      <td className="px-4 py-2">{booking.user?.FirstName || 'N/A'} {booking.user?.LastName || ''}</td>
                      <td className="px-4 py-2">{booking.cricksalArena?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-2">{booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm font-medium
                          ${booking.status === 'completed'
                            ? 'bg-green-500/20 text-green-200'
                            : booking.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-200'
                              : 'bg-blue-500/20 text-blue-200'}
                        `}>
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
            className="mt-4 text-blue-400 hover:text-blue-300 font-semibold"
          >
            View All Bookings
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OwnerDashboard;
