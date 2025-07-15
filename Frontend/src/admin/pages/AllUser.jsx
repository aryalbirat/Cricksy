
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AllUsersForAdmin = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
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
  const [role, setRole] = useState('');

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/allusers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          ...sort,
          page,
          limit: pagination.limit,
          role,
        },
      });

      setUsers(response.data.users || []);
      setPagination(response.data.pagination);
      setLoading(false);
      setError(response.data.users.length === 0 && (search || role) ? 'No users found for your search or role.' : null);
    } catch (err) {
      console.error('Error fetching users:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Error fetching users');
      setLoading(false);
      setUsers([]);
    }
  }, [search, sort, page, pagination.limit, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSortOrderChange = (e) => {
    setSort({ ...sort, sortOrder: e.target.value });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-6 ml-64">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
        All Users
      </h1>

      {/* Search, Role Filter, and Sort Controls */}
      <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <form onSubmit={handleSearch} className="flex-grow flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username"
              className="px-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 flex-grow"
            />
            <select
              value={role}
              onChange={handleRoleChange}
              className="px-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
            >
              Search
            </button>
          </form>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-300">Sort by Created At:</span>
            <select
              value={sort.sortOrder}
              onChange={handleSortOrderChange}
              className="px-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {(error || users.length === 0) && (
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-red-900/30 p-6 mb-8">
          <div className="text-center py-8 text-red-300">
            {error || 'No users found'}
          </div>
        </div>
      )}

      {/* Users Table */}
      {users.length > 0 && (
        <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-blue-900/30 p-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-900/50">
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">First Name</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Last Name</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Address</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-medium">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-blue-900/30 hover:bg-blue-900/20 transition-colors">
                    <td className="px-4 py-3 text-gray-200">
                      {user.FirstName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-200">
                      {user.LastName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-200">
                      {user.Email || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50'
                            : user.role === 'owner'
                            ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                            : user.role === 'user'
                            ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
                            : 'bg-gray-900/50 text-gray-300 border border-gray-700/50'
                        }`}
                      >
                        {user.role || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-200">
                      {user.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-200">
                      <div className="max-w-xs truncate">
                        {user.address || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-200">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-900/30">
            <div className="text-sm text-gray-300">
              Showing {users.length} of {pagination.totalUsers} users
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


export default AllUsersForAdmin;