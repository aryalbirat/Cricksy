
import { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    totalReviews: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  const fetchReviews = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/reviews', {
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

      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
      setLoading(false);
      // Set error for no reviews found after search
      setError(response.data.reviews.length === 0 && search ? 'No reviews found for your search.' : null);
    } catch (err) {
      console.error('Error fetching reviews:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Error fetching reviews');
      setLoading(false);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
        Reviews
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
              <option value="createdAt">Date</option>
              <option value="rating">Rating</option>
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
      {(error || reviews.length === 0) && (
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-red-900/30 p-6 mb-8">
          <div className="text-center py-8 text-red-300">
            {error || 'No reviews found'}
          </div>
        </div>
      )}

      {/* Table and Pagination (only shown if reviews exist) */}
      {reviews.length > 0 && (
        <>
          <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-900/50">
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Cricksal Arena
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Comment
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id} className="border-b border-blue-900/30 hover:bg-blue-900/20 transition-colors">
                      <td className="px-4 py-3 text-gray-200">
                        {review.user ? `${review.user.FirstName} ${review.user.LastName}` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-200">
                        {review.cricksal?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-200">
                        {review.cricksal?.location || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-200">
                        <div className="max-w-xs truncate">
                          {review.comment || 'No comment'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-200">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          {review.rating || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-200">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-900/30">
              <div className="text-sm text-gray-300">
                Showing {reviews.length} of {pagination.totalReviews} reviews
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


export default Reviews;