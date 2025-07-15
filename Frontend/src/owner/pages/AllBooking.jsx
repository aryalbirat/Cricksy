import { useState, useEffect } from 'react';
import axios from 'axios';


//allbookings component
const AllBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    totalBookings: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    sortBy: 'bookingDate',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/owner/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          ...sort,
          page,
          limit: pagination.limit,
        },
      });

      setBookings(response.data.bookings || []);
      setPagination(response.data.pagination);
      setLoading(false);
      setError(response.data.bookings.length === 0 && search ? 'No bookings found for your search.' : null);
    } catch (err) {
      console.error('Error fetching bookings:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Error fetching bookings');
      setLoading(false);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleSortFieldChange = (e) => {
    setSort({ ...sort, sortBy: e.target.value });
  };

  const handleSortOrderChange = (e) => {
    setSort({ ...sort, sortOrder: e.target.value });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className="text-center text-blue-400 font-semibold py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">All Bookings</h2>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <form onSubmit={handleSearch} className="flex-grow w-full md:w-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username or cricksal name"
              className="px-4 py-2 bg-black/40 border border-blue-900 text-white placeholder-gray-400 rounded-md w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex gap-4">
          <select
            value={sort.sortBy}
            onChange={handleSortFieldChange}
            className="px-4 py-2 bg-black/40 text-white border border-blue-800 rounded-md"
          >
            <option value="bookingDate">Booking Date</option>
            <option value="totalAmount">Total Amount</option>
            <option value="createdAt">Created At</option>
          </select>
          <select
            value={sort.sortOrder}
            onChange={handleSortOrderChange}
            className="px-4 py-2 bg-black/40 text-white border border-blue-800 rounded-md"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {(error || bookings.length === 0) && (
        <div className="text-center py-10 text-red-400">
          {error || 'No bookings found'}
        </div>
      )}

      {/* Table */}
      {bookings.length > 0 && (
        <>
          <div className="overflow-x-auto shadow-lg rounded-2xl bg-black/30 backdrop-blur border border-blue-900">
            <table className="min-w-full divide-y divide-blue-800">
              <thead className="bg-black/50">
                <tr>
                  {[
                    'Booking ID',
                    'Cricksal Arena',
                    'User',
                    'Booking Date',
                    'Start Time',
                    'End Time',
                    'Status',
                    'Total Amount',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-blue-900/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{booking._id}</td>
                    <td className="px-6 py-4 text-sm">{booking.cricksalArena?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{booking.user ? `${booking.user.FirstName} ${booking.user.LastName}` : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{booking.startTime || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{booking.endTime || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-300'
                            : booking.status === 'upcoming'
                            ? 'bg-blue-500/20 text-blue-300'
                            : booking.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'}
                        `}
                      >
                        {booking?.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">₨{booking.totalAmount || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-blue-200">
              Showing {bookings.length} of {pagination.totalBookings} bookings
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-black/50 text-white border border-blue-700 rounded hover:bg-blue-900 disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="px-4 py-2 bg-black/50 text-white border border-blue-700 rounded hover:bg-blue-900 disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllBooking;
