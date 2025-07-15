import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

// ArenaReview 
const ArenaReview = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    totalReviews: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(1);

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/owner/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
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
      setError(
        response.data.reviews.length === 0 && search
          ? "No reviews found for your search."
          : null
      );
    } catch (err) {
      console.error("Error fetching reviews:", err.response || err.message);
      setError(err.response?.data?.message || "Error fetching reviews");
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black to-blue-900 text-teal-400 font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-950 text-white px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">My Cricksal Reviews</h2>

      {/* Search & Sort Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center">
        <form onSubmit={handleSearch} className="flex-grow">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by cricksal name"
              className="flex-grow px-4 py-2 rounded-md bg-black/40 border border-blue-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex gap-3">
          <select
            value={sort.sortBy}
            onChange={handleSortFieldChange}
            className="px-4 py-2 rounded-md bg-black/40 border border-blue-800 text-white"
          >
            <option value="createdAt">Date</option>
            <option value="rating">Rating</option>
          </select>
          <select
            value={sort.sortOrder}
            onChange={handleSortOrderChange}
            className="px-4 py-2 rounded-md bg-black/40 border border-blue-800 text-white"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {(error || reviews.length === 0) && (
        <div className="text-center py-10 text-red-400 text-lg font-medium">
          {error || "No reviews found"}
        </div>
      )}

      {/* Reviews Table */}
      {reviews.length > 0 && (
        <>
          <div className="overflow-x-auto bg-black/40 backdrop-blur-md border border-blue-900/60 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-blue-800">
              <thead>
                <tr className="bg-black/30 border-b border-blue-800 text-blue-300 text-xs uppercase">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Cricksal</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Comment</th>
                  <th className="px-6 py-3 text-left">Rating</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="text-white divide-y divide-blue-800">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-blue-900/30">
                    <td className="px-6 py-4">{review.user ? `${review.user.FirstName} ${review.user.LastName}` : "N/A"}</td>
                    <td className="px-6 py-4">{review.cricksal?.name || "N/A"}</td>
                    <td className="px-6 py-4">{review.cricksal?.location || "N/A"}</td>
                    <td className="px-6 py-4">{review.comment || "No comment"}</td>
                    <td className="px-6 py-4">{review.rating || "N/A"}</td>
                    <td className="px-6 py-4">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-blue-300">
              Showing {reviews.length} of {pagination.totalReviews} reviews
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 bg-black/30 border border-blue-800 text-white rounded disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span className="text-blue-200">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="px-4 py-2 bg-black/30 border border-blue-800 text-white rounded disabled:opacity-50"
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

export default ArenaReview;
