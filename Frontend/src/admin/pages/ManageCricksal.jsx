import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from "react-icons/fa";

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
      const response = await axios.get('http://localhost:8000/api/cricksals', {
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
      await axios.delete(`http://localhost:8000/api/cricksals/${cricksalId}`, {
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

  if (loading) return <div className="text-center text-teal-400 font-semibold">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Cricksals</h2>

      {/* Search input */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search cricksals by name"
          className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-center py-4 text-red-500">{error}</div>
      )}

      {!error && cricksals.length === 0 && search.trim() !== "" ? (
        <div className="text-center py-10 text-gray-500">No cricksals found</div>
      ) : !error && cricksals.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No cricksals available</div>
      ) : (
        !error && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cricksal Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per Hour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cricksals.map((cricksal) => (
                  <tr key={cricksal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cricksal.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cricksal.createdBy ? `${cricksal.createdBy.FirstName} ${cricksal.createdBy.LastName}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₨{cricksal.pricePerHour}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cricksal.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cricksal.images && cricksal.images.length > 0 ? (
                        <img
                          src={`http://localhost:8000/${cricksal.images[0]}`}
                          alt={`Cricksal ${cricksal.name}`}
                          className="w-16 h-16 object-cover rounded-md shadow-md"
                        />
                      ) : (
                        <span>No image available</span>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-red-600 hover:text-red-800 p-2"
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
        )
      )}

      {!error && cricksals.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {cricksals.length} of {pagination.totalItems} arenas
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCricksal;