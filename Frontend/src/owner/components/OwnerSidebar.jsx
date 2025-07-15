import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFutbol,
  FaBook,
  FaMoneyBill,
  FaStar,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";

const OwnerSidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  return (
    <div className="w-64 h-screen bg-dark-950/95 backdrop-blur-xl shadow-2xl flex flex-col p-6 fixed top-0 left-0 overflow-y-auto border-r border-dark-800/50">
      <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-8">
        Owner Panel
      </h2>
      <nav className="flex-1">
        <ul>
          <li className="mb-3">
            <Link to="/owner" className="sidebar-link">
              <FaTachometerAlt className="text-primary-400" /> Dashboard
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/owner/cricksal" className="sidebar-link">
              <FaFutbol className="text-accent-400" /> Cricksal
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/owner/bookings" className="sidebar-link">
              <FaBook className="text-success-400" /> Bookings
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/owner/payments" className="sidebar-link">
              <FaMoneyBill className="text-warning-400" /> Payments
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/owner/reviews" className="sidebar-link">
              <FaStar className="text-warning-400" /> Reviews
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/owner/profile" className="sidebar-link">
              <FaUser className="text-accent-400" /> Profile
            </Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-danger-600 to-danger-700 text-white hover:from-danger-700 hover:to-danger-800 transition-all duration-300 shadow-lg hover:shadow-danger-500/25"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default OwnerSidebar;
