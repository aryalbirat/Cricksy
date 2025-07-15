import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaTimes, FaSave } from 'react-icons/fa';

const Bookings = () => {
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
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    totalAmount: '',
    status: ''
  });

  const fetchBookings = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/bookings', {
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
  }, [search, sort, page, pagination.limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      setPagination((prev) => ({
        ...prev,
        totalBookings: prev.totalBookings - 1,
        totalPages: Math.ceil((prev.totalBookings - 1) / prev.limit),
      }));
      alert('Booking deleted successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking');
    }
  };

  const startEdit = (booking) => {
    setEditingBooking(booking._id);
    setEditForm({
      bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalAmount: booking.totalAmount,
      status: booking.status
    });
  };

  const cancelEdit = () => {
    setEditingBooking(null);
    setEditForm({
      bookingDate: '',
      startTime: '',
      endTime: '',
      totalAmount: '',
      status: ''
    });
  };

  const updateBooking = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/bookings/${id}`, editForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Update the bookings list with the updated booking
      setBookings((prev) => prev.map((booking) => 
        booking._id === id ? response.data.booking : booking
      ));
      
      cancelEdit();
      alert('Booking updated successfully');
    } catch (err) {
      console.error('Error updating booking:', err);
      alert(err.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
        Bookings
      </h1>

      {/* Search and Sort Controls */}
      <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <form onSubmit={handleSearch} className="flex-grow flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username or cricksal name"
              className="px-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 flex-grow"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
            >
              Search
            </button>
          </form>
          <div className="flex gap-4">
            <select
              value={sort.sortBy}
              onChange={handleSortFieldChange}
              className="px-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="bookingDate">Booking Date</option>
              <option value="totalAmount">Total Amount</option>
            </select>
            <select
              value={sort.sortOrder}
              onChange={handleSortOrderChange}
              className="px-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {(error || bookings.length === 0) && (
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-red-900/30 p-6 mb-8">
          <div className="text-center py-8 text-red-300">
            {error || 'No bookings found'}
          </div>
        </div>
      )}

      {/* Table and Pagination (only shown if bookings exist) */}
      {bookings.length > 0 && (
        <>
          <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-900/50">
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Booking ID
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Cricksal Arena
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Booking Date
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Start Time
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      End Time
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Total Amount
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-blue-900/30 hover:bg-blue-900/20 transition-colors">
                      <td className="px-4 py-3 text-gray-200 text-sm">
                        {booking._id}
                      </td>
                      <td className="px-4 py-3 text-gray-200 text-sm">
                        {booking.cricksalArena ? booking.cricksalArena.name : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-200 text-sm">
                        {booking.user ? `${booking.user.FirstName} ${booking.user.LastName}` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-200 text-sm">
                        {editingBooking === booking._id ? (
                          <input
                            type="date"
                            value={editForm.bookingDate}
                            onChange={(e) => handleEditFormChange('bookingDate', e.target.value)}
                            className="w-full px-2 py-1 bg-black/50 border border-blue-900/50 rounded text-white"
                          />
                        ) : (
                          booking.bookingDate
                            ? new Date(booking.bookingDate).toLocaleDateString()
                            : 'N/A'
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-200 text-sm">
                        {editingBooking === booking._id ? (
                          <input
                            type="time"
                            value={editForm.startTime}
                            onChange={(e) => handleEditFormChange('startTime', e.target.value)}
                            className="w-full px-2 py-1 bg-black/50 border border-blue-900/50 rounded text-white"
                          />
                        ) : (
                          booking.startTime || 'N/A'
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-200 text-sm">
                        {editingBooking === booking._id ? (
                          <input
                            type="time"
                            value={editForm.endTime}
                            onChange={(e) => handleEditFormChange('endTime', e.target.value)}
                            className="w-full px-2 py-1 bg-black/50 border border-blue-900/50 rounded text-white"
                          />
                        ) : (
                          booking.endTime || 'N/A'
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingBooking === booking._id ? (
                          <select
                            value={editForm.status}
                            onChange={(e) => handleEditFormChange('status', e.target.value)}
                            className="w-full px-2 py-1 bg-black/50 border border-blue-900/50 rounded text-white"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed'
                                ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                                : booking.status === 'cancelled'
                                ? 'bg-red-900/50 text-red-300 border border-red-700/50'
                                : 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
                            }`}
                          >
                            {booking?.status || 'N/A'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-200 text-sm">
                        {editingBooking === booking._id ? (
                          <input
                            type="number"
                            value={editForm.totalAmount}
                            onChange={(e) => handleEditFormChange('totalAmount', e.target.value)}
                            className="w-full px-2 py-1 bg-black/50 border border-blue-900/50 rounded text-white"
                          />
                        ) : (
                          `₨${booking.totalAmount || 'N/A'}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingBooking === booking._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateBooking(booking._id)}
                              className="text-green-400 hover:text-green-300 p-2 rounded hover:bg-green-900/20 transition-colors"
                              title="Save changes"
                            >
                              <FaSave size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-400 hover:text-gray-300 p-2 rounded hover:bg-gray-900/20 transition-colors"
                              title="Cancel editing"
                            >
                              <FaTimes size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(booking)}
                              className="text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-blue-900/20 transition-colors"
                              title="Edit booking"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => deleteBooking(booking._id)}
                              className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-900/20 transition-colors"
                              title="Delete booking"
                            >
                              <FaTrashAlt size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-900/30">
              <div className="text-sm text-gray-300">
                Showing {bookings.length} of {pagination.totalBookings} bookings
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-black/50 border border-blue-900/50 text-gray-300 rounded-lg hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-300 flex items-center">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-black/50 border border-blue-900/50 text-gray-300 rounded-lg hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Bookings;