
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaFutbol, FaStar, FaCalendarCheck } from 'react-icons/fa';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  const { users, cricksals, bookings, reviews } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 flex items-center space-x-4 hover:border-blue-700/50 transition-all duration-300">
          <FaUsers className="text-blue-400 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Total Users</h2>
            <p className="text-2xl font-bold text-white">{users.length || 0}</p>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 flex items-center space-x-4 hover:border-blue-700/50 transition-all duration-300">
          <FaFutbol className="text-cyan-400 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Total Cricksals</h2>
            <p className="text-2xl font-bold text-white">{cricksals.length || 0}</p>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 flex items-center space-x-4 hover:border-blue-700/50 transition-all duration-300">
          <FaCalendarCheck className="text-green-400 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Total Bookings</h2>
            <p className="text-2xl font-bold text-white">{bookings.length || 0}</p>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 flex items-center space-x-4 hover:border-blue-700/50 transition-all duration-300">
          <FaStar className="text-yellow-400 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Total Reviews</h2>
            <p className="text-2xl font-bold text-white">{reviews.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-900/50">
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">User</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Cricksal</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Time</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="border-b border-blue-900/30 hover:bg-blue-900/20 transition-colors">
                    <td className="px-4 py-3 text-gray-200">
                      {booking.user?.FirstName || 'N/A'} {booking.user?.LastName || ''}
                    </td>
                    <td className="px-4 py-3 text-gray-200">{booking.cricksalArena?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-200">
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-200">
                      {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed'
                            ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                            : booking.status === 'upcoming'
                            ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
                            : booking.status === 'cancelled'
                            ? 'bg-red-900/50 text-red-300 border border-red-700/50'
                            : 'bg-gray-900/50 text-gray-300 border border-gray-700/50'
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
          className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
        >
          View All Bookings
        </button>
      </div>

      {/* Recent Cricksals Table */}
      <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">Recent Cricksals</h2>
        {cricksals.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No cricksals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-900/50">
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Location</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Owner</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Price/Hour</th>
                </tr>
              </thead>
              <tbody>
                {cricksals.slice(0, 5).map((cricksal) => (
                  <tr key={cricksal._id} className="border-b border-blue-900/30 hover:bg-blue-900/20 transition-colors">
                    <td className="px-4 py-3 text-gray-200">{cricksal.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-200">{cricksal.location || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-200">
                      {cricksal.createdBy?.FirstName || 'N/A'} {cricksal.createdBy?.LastName || ''}
                    </td>
                    <td className="px-4 py-3 text-gray-200">
                      Rs. {cricksal.pricePerHour || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          onClick={() => navigate('/admin/arenas')}
          className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
        >
          View All Cricksals
        </button>
      </div>
    </div>
  );
};


// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUsers, FaFutbol, FaStar, FaCalendarCheck } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const AdminDashboard = () => {
//   const [dashboardData, setDashboardData] = useState({
//     users: [],
//     cricksals: [],
//     bookings: [],
//     reviews: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         const config = { headers: { Authorization: `Bearer ${token}` } };

//         const [usersRes, cricksalsRes, bookingsRes, reviewsRes] = await Promise.all([
//           axios.get('http://localhost:8000/api/admin/allusers', config).catch(() => ({ data: { users: [] } })),
//           axios.get('http://localhost:8000/api/cricksals', config).catch(() => ({ data: { cricksals: [] } })),
//           axios.get('http://localhost:8000/api/admin/bookings', config).catch(() => ({ data: { bookings: [] } })),
//           axios.get('http://localhost:8000/api/admin/reviews', config).catch(() => ({ data: { reviews: [] } })),
//         ]);

//         setDashboardData({
//           users: usersRes.data.users || [],
//           cricksals: cricksalsRes.data.cricksals || [],
//           bookings: bookingsRes.data.bookings || [],
//           reviews: reviewsRes.data.reviews || [],
//         });
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err.message);
//         setDashboardData({
//           users: [],
//           cricksals: [],
//           bookings: [],
//           reviews: [],
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-white text-xl">Loading dashboard...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-red-400 text-xl">{error}</div>
//         </div>
//       </div>
//     );
//   }

//   const { users, cricksals, bookings, reviews } = dashboardData;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
//       <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
//         Admin Dashboard
//       </h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 flex items-center space-x-4 hover:border-blue-700/50 transition-all duration-300">
//           <FaUsers className="text-blue-400 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-300">Total Users</h2>
//             <p className="text-2xl font-bold text-white">{users.length || 0}</p>
//           </div>
//         </div>
//         <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 flex items-center space-x-4 hover:border-blue-700/50 transition-all duration-300">
//           <FaFutbol className="text-cyan-400 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-300">Total Cricksals</h2>
//             <p className="text-2xl font-bold text-white">{cricksals.length || 0}</p>
//           </div>
//         </div>
//         <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 flex items-center space-x-4 hover:border-blue-700/50 transition-all duration-300">
//           <FaCalendarCheck className="text-green-400 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-300">Total Bookings</h2>
//             <p className="text-2xl font-bold text-white">{bookings.length || 0}</p>
//           </div>
//         </div>
//         <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 flex items-center space-x-4 hover:border-blue-700/50 transition-all duration-300">
//           <FaStar className="text-yellow-400 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-300">Total Reviews</h2>
//             <p className="text-2xl font-bold text-white">{reviews.length || 0}</p>
//           </div>
//         </div>
//       </div>

//       {/* Recent Bookings Table */}
//       <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
//         <h2 className="text-xl font-semibold text-blue-400 mb-4">Recent Bookings</h2>
//         {bookings.length === 0 ? (
//           <p className="text-gray-400 text-center py-8">No bookings yet.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-blue-900/50">
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">User</th>
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">Cricksal</th>
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">Date</th>
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">Time</th>
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bookings.slice(0, 5).map((booking) => (
//                   <tr key={booking._id} className="border-b border-blue-900/30 hover:bg-blue-900/20 transition-colors">
//                     <td className="px-4 py-3 text-gray-200">
//                       {booking.user?.FirstName || 'N/A'} {booking.user?.LastName || ''}
//                     </td>
//                     <td className="px-4 py-3 text-gray-200">{booking.cricksalArena?.name || 'N/A'}</td>
//                     <td className="px-4 py-3 text-gray-200">
//                       {booking.bookingDate
//                         ? new Date(booking.bookingDate).toLocaleDateString()
//                         : 'N/A'}
//                     </td>
//                     <td className="px-4 py-3 text-gray-200">
//                       {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           booking.status === 'completed'
//                             ? 'bg-green-900/50 text-green-300 border border-green-700/50'
//                             : booking.status === 'upcoming'
//                             ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
//                             : booking.status === 'cancelled'
//                             ? 'bg-red-900/50 text-red-300 border border-red-700/50'
//                             : 'bg-gray-900/50 text-gray-300 border border-gray-700/50'
//                         }`}
//                       >
//                         {booking.status || 'N/A'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//         <button
//           onClick={() => navigate('/admin/bookings')}
//           className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
//         >
//           View All Bookings
//         </button>
//       </div>

//       {/* Recent Cricksals Table */}
//       <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6">
//         <h2 className="text-xl font-semibold text-blue-400 mb-4">Recent Cricksals</h2>
//         {cricksals.length === 0 ? (
//           <p className="text-gray-400 text-center py-8">No cricksals yet.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-blue-900/50">
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">Name</th>
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">Location</th>
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">Owner</th>
//                   <th className="px-4 py-3 text-left text-gray-300 font-medium">Price/Hour</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cricksals.slice(0, 5).map((cricksal) => (
//                   <tr key={cricksal._id} className="border-b border-blue-900/30 hover:bg-blue-900/20 transition-colors">
//                     <td className="px-4 py-3 text-gray-200">{cricksal.name || 'N/A'}</td>
//                     <td className="px-4 py-3 text-gray-200">{cricksal.location || 'N/A'}</td>
//                     <td className="px-4 py-3 text-gray-200">
//                       {cricksal.createdBy?.FirstName || 'N/A'} {cricksal.createdBy?.LastName || ''}
//                     </td>
//                     <td className="px-4 py-3 text-gray-200">
//                       Rs. {cricksal.pricePerHour || 'N/A'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//         <button
//           onClick={() => navigate('/admin/arenas')}
//           className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
//         >
//           View All Cricksals
//         </button>
//       </div>
//     </div>
//   );
// };


export default AdminDashboard;