
import { useState, useEffect } from 'react';
import { API_BASE_URL, getImageUrl } from "../../config/api";
import axios from 'axios';

const ManageCricksal = () => {
  const [cricksals, setCricksals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    pageSize: 5,
  });
  const [search, setSearch] = useState("");

  // Fetch cricksals with pagination and search
  const fetchCricksals = async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cricksals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          page,
          search: search.trim(),
        },
      });

      setCricksals(response.data.cricksals || []);
      setPagination(response.data.pagination);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cricksals');
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle delete cricksal
  const handleDelete = async (cricksalId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cricksals/${cricksalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCricksals(cricksals.filter(cricksal => cricksal._id !== cricksalId));
      setPagination((prev) => ({
        ...prev,
        totalItems: prev.totalItems - 1,
        totalPages: Math.ceil((prev.totalItems - 1) / prev.pageSize),
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting cricksal');
    }
  };

  useEffect(() => {
    fetchCricksals(pagination.currentPage);
  }, [search, pagination.currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading cricksals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
        Manage Arenas
      </h1>

      {/* Search input */}
      <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search cricksals by name"
            className="px-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 flex-grow max-w-md"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-red-900/30 p-6 mb-8">
          <div className="text-center py-8 text-red-300">{error}</div>
        </div>
      )}

      {/* No cricksals found messages */}
      {!error && cricksals.length === 0 && search.trim() !== "" ? (
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
          <div className="text-center py-8 text-gray-300">No cricksals found</div>
        </div>
      ) : !error && cricksals.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
          <div className="text-center py-8 text-gray-300">No cricksals available</div>
        </div>
      ) : (
        !error && (
          <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-900/50">
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Cricksal Name</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Owner</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Price per Hour</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Location</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Image</th>
                    {/* <th className="px-4 py-3 text-left text-gray-300 font-medium">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {cricksals.map((cricksal) => (
                    <tr key={cricksal._id} className="border-b border-blue-900/30 hover:bg-blue-900/20 transition-colors">
                      <td className="px-4 py-3 text-gray-200">{cricksal.name}</td>
                      <td className="px-4 py-3 text-gray-200">
                        {cricksal.createdBy ? `${cricksal.createdBy.FirstName} ${cricksal.createdBy.LastName}` : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-200">₨{cricksal.pricePerHour}</td>
                      <td className="px-4 py-3 text-gray-200">{cricksal.location}</td>
                      <td className="px-4 py-3 text-gray-200">
                        {cricksal.images && cricksal.images.length > 0 ? (
                          <img
                            src={getImageUrl(cricksal.images[0])}
                            alt={`Cricksal ${cricksal.name}`}
                            className="w-16 h-16 object-cover rounded-md shadow-md border border-blue-900/30"
                          />
                        ) : (
                          <span>No image available</span>
                        )}
                      </td>
                      {/* <td className="px-4 py-3 text-gray-200">
                        <button
                          className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-900/20 transition-colors"
                          onClick={() => handleDelete(cricksal._id)}
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Pagination */}
      {!error && cricksals.length > 0 && (
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-300">
              Showing {cricksals.length} of {pagination.totalItems} arenas
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
        
      )}
    </div>
  );
};

export default ManageCricksal;
