import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from Redux
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <motion.header 
      className="bg-black/95 backdrop-blur-xl border-b border-blue-900/30 shadow-2xl sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <motion.h1 
            className="font-bold text-3xl text-blue-400"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            CricksalHub
          </motion.h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-gray-300 font-medium text-lg">
          <Link to="/" className="hover:text-blue-400 transition-colors duration-300">
            <motion.li 
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Home
            </motion.li>
          </Link>
          <Link to="/findcricksalcourts" className="hover:text-blue-400 transition-colors duration-300">
            <motion.li 
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Find Courts
            </motion.li>
          </Link>
          <Link to="/about" className="hover:text-blue-400 transition-colors duration-300">
            <motion.li 
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              About Us
            </motion.li>
          </Link>
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <motion.button
                className="flex items-center font-medium text-gray-300 hover:text-blue-400 text-lg transition-colors duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <FaUserCircle className="mr-2 text-blue-400" />
                {`${user.FirstName} ${user.LastName}`}
              </motion.button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-blue-900/30 rounded-xl shadow-2xl z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="py-2 text-lg">
                      <li>
                        <Link
                          to="/UserProfile"
                          className="block px-4 py-3 text-gray-300 hover:bg-blue-900/20 hover:text-blue-400 transition-colors duration-300"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/mybooking"
                          className="block px-4 py-3 text-gray-300 hover:bg-blue-900/20 hover:text-blue-400 transition-colors duration-300"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Booking
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-gray-300 hover:bg-blue-900/20 hover:text-red-400 transition-colors duration-300"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="font-medium text-gray-300 hover:text-blue-400 text-lg transition-colors duration-300"
              >
                {/* <motion.span
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  Login
                </motion.span> */}
              </Link>
              <Link
                to="/signup"
                className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-900/50"
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  Sign Up
                </motion.span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-blue-400 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-blue-900/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-6 py-4 space-y-2">
              <Link
                to="/"
                className="block py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/findcricksalcourts"
                className="block py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Courts
              </Link>
              <Link
                to="/about"
                className="block py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;