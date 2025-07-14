import { Link } from "react-router-dom";
import {
  FaGauge,
  FaUserGroup,
  FaUsers,
  FaFutbol,
  FaMoneyBillWave,
  FaStar,
  FaChartBar,
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
    <div className="w-64 h-screen bg-dark-950/95 backdrop-blur-xl shadow-2xl flex flex-col p-6 fixed top-0 left-0 overflow-y-auto border-r border-dark-800/50">
      <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-8">Admin Panel</h2>
      <nav className="flex-1">
        <ul>
          <li className="mb-3">
            <Link
              to="/"
              className="sidebar-link"
            >
              <FaGauge className="text-primary-400" /> Dashboard
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/users"
              className="sidebar-link"
            >
              <FaUserGroup className="text-primary-400" /> Users
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/arenas"
              className="sidebar-link"
            >
              <FaUsers className="text-primary-400" /> Arenas
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/bookings"
              className="sidebar-link"
            >
              <FaFutbol className="text-primary-400" /> Bookings
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/reviews"
              className="sidebar-link"
            >
              <FaStar className="text-primary-400" /> Reviews
            </Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-danger-600 to-danger-700 text-white hover:from-danger-700 hover:to-danger-800 transition-all duration-300 shadow-lg hover:shadow-danger-500/25"
      >
        <FaArrowRightFromBracket /> Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
