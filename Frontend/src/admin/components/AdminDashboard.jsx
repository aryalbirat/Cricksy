
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaFutbol, FaMoneyBillWave, FaStar, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    users: [],
    cricksals: [],
    bookings: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [usersRes, cricksalsRes, bookingsRes, reviewsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/admin/allusers', config).catch(() => ({ data: { users: [] } })),
          axios.get('http://localhost:8000/api/cricksals', config).catch(() => ({ data: { cricksals: [] } })),
          axios.get('http://localhost:8000/api/admin/bookings', config).catch(() => ({ data: { bookings: [] } })),
          axios.get('http://localhost:8000/api/admin/reviews', config).catch(() => ({ data: { reviews: [] } })),
        ]);

        setDashboardData({
          users: usersRes.data.users || [],
          cricksals: cricksalsRes.data.cricksals || [],
          bookings: bookingsRes.data.bookings || [],
          reviews: reviewsRes.data.reviews || [],
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
        // Treat 404 or any error as empty data
        setDashboardData({
          users: [],
          cricksals: [],
          bookings: [],
          reviews: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  const { users, cricksals, bookings, reviews } = dashboardData;

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-8">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="modern-card flex items-center space-x-4">
          <FaUsers className="text-primary-400 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-dark-300">Total Users</h2>
            <p className="text-2xl font-bold text-gradient">{users.length || 0}</p>
          </div>
        </div>
        <div className="modern-card flex items-center space-x-4">
          <FaFutbol className="text-accent-400 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-dark-300">Total Cricksals</h2>
            <p className="text-2xl font-bold text-gradient">{cricksals.length || 0}</p>
          </div>
        </div>
        <div className="modern-card flex items-center space-x-4">
          <FaCalendarCheck className="text-success-400 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-dark-300">Total Bookings</h2>
            <p className="text-2xl font-bold text-gradient">{bookings.length || 0}</p>
          </div>
        </div>
        <div className="modern-card flex items-center space-x-4">
          <FaStar className="text-warning-400 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-dark-300">Total Reviews</h2>
            <p className="text-2xl font-bold text-gradient">{reviews.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="modern-card mb-8">
        <h2 className="text-xl font-semibold text-gradient mb-4">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-dark-400 text-center py-4">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-dark-800/50 border-b border-dark-700">
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">User</th>
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Cricksal</th>
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Time</th>
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="border-b border-dark-800/50 hover:bg-dark-800/25 transition-colors">
                    <td className="px-4 py-3 text-dark-200">
                      {booking.user?.FirstName || 'N/A'} {booking.user?.LastName || ''}
                    </td>
                    <td className="px-4 py-3 text-dark-200">{booking.cricksalArena?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-dark-200">
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-dark-200">
                      {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed'
                            ? 'bg-success-500/20 text-success-300'
                            : booking.status === 'pending'
                            ? 'bg-warning-500/20 text-warning-300'
                            : 'bg-primary-500/20 text-primary-300'
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
        )}
        <button
          onClick={() => navigate('/admin/bookings')}
          className="mt-4 text-primary-400 hover:text-primary-300 font-semibold transition-colors"
        >
          View All Bookings
        </button>
      </div>

      {/* Recent Cricksals Table */}
      <div className="modern-card">
        <h2 className="text-xl font-semibold text-gradient mb-4">Recent Cricksals</h2>
        {cricksals.length === 0 ? (
          <p className="text-dark-400 text-center py-4">No cricksals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-dark-800/50 border-b border-dark-700">
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Location</th>
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Owner</th>
                </tr>
              </thead>
              <tbody>
                {cricksals.slice(0, 5).map((cricksal) => (
                  <tr key={cricksal._id} className="border-b border-dark-800/50 hover:bg-dark-800/25 transition-colors">
                    <td className="px-4 py-3 text-dark-200">{cricksal.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-dark-200">{cricksal.location || 'N/A'}</td>
                    <td className="px-4 py-3 text-dark-200">
                      {cricksal.createdBy?.FirstName || 'N/A'} {cricksal.createdBy?.LastName || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          onClick={() => navigate('/admin/arenas')}
          className="mt-4 text-primary-400 hover:text-primary-300 font-semibold transition-colors"
        >
          View All Cricksals
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;