import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFutbol,
  FaBook,
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
    <aside className="w-64 h-screen fixed top-0 left-0 bg-black/60 backdrop-blur-lg border-r border-blue-800 shadow-2xl z-50 flex flex-col p-6 text-white">
      <h2 className="text-3xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Owner Panel
      </h2>

      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link
              to="/owner"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-800/30 transition"
            >
              <FaTachometerAlt className="text-blue-400" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/owner/cricksal"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-800/30 transition"
            >
              <FaFutbol className="text-teal-400" />
              <span className="text-sm font-medium">Cricksal</span>
            </Link>
          </li>
          <li>
            <Link
              to="/owner/bookings"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-800/30 transition"
            >
              <FaBook className="text-green-400" />
              <span className="text-sm font-medium">Bookings</span>
            </Link>
          </li>
          <li>
            {/* <Link
              to="/owner/payments"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-800/30 transition"
            >
              <FaMoneyBill className="text-yellow-400" />
              <span className="text-sm font-medium">Payments</span>
            </Link> */}
          </li>
          <li>
            <Link
              to="/owner/reviews"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-800/30 transition"
            >
              <FaStar className="text-yellow-400" />
              <span className="text-sm font-medium">Reviews</span>
            </Link>
          </li>
          <li>
            <Link
              to="/owner/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-800/30 transition"
            >
              <FaUser className="text-purple-400" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-10 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition shadow-md hover:shadow-red-500/30"
      >
        <FaSignOutAlt />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </aside>
  );
};

export default OwnerSidebar;
