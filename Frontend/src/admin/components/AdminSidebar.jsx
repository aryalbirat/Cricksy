import { Link } from "react-router-dom";
import {
  FaGauge,
  FaUserGroup,
  FaUsers,
  FaFutbol,
  FaStar,
  FaArrowRightFromBracket
} from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";

const AdminSidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg flex flex-col p-6 fixed top-0 left-0 overflow-y-auto border-r border-gray-700">
      <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-8">Admin Panel</h2>
      <nav className="flex-1">
        <ul>
          <li className="mb-3">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              <FaGauge className="text-blue-400" /> Dashboard
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              <FaUserGroup className="text-blue-400" /> Users
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/arenas"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              <FaUsers className="text-blue-400" /> Arenas
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/bookings"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              <FaFutbol className="text-blue-400" /> Bookings
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/reviews"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              <FaStar className="text-blue-400" /> Reviews
            </Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-red-500/50"
      >
        <FaArrowRightFromBracket /> Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
