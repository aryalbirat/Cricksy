import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../../features/user/userSlice";
import { useNavigate, Link } from "react-router-dom";
import cricksalimage from "../../image/2.jpg"; 
import { ToastContainer, toast } from 'react-toastify';
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    Email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        Email: formData.Email,
        password: formData.password,
      });

      if (response.status === 200) {
        console.log("User data: ", response.data.user);
        toast.success("Welcome back!");

        let user = response.data.user;
        localStorage.setItem("token", response.data.token);
        dispatch(login(user));

        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/admin");
          } else if (user.role === "owner") {
            navigate("/owner");
          } else {
            navigate("/");
          }
        }, 1000);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage("Invalid email or password");
      } else if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        if (firstError.params === "Email") {
          setErrorMessage("Please enter a valid email address.");
        } else if (firstError.params === "password") {
          setErrorMessage("Password must be at least 8 characters");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } else {
        setErrorMessage(error.response?.data?.msg || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 flex items-center justify-center p-4">
      <ToastContainer/>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-900/30 flex flex-col md:flex-row overflow-hidden"
        >
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-blue-400 mb-2">Welcome Back</h2>
              <p className="text-gray-300">Sign in to continue your cricksal journey</p>
            </motion.div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-900/30 border border-red-800/30 text-red-300 p-4 rounded-lg mb-6"
              >
                {errorMessage}
              </motion.div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <label
                  htmlFor="email"
                  className="block text-gray-300 text-sm mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.Email}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <label
                  htmlFor="password"
                  className="block text-gray-300 text-sm mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-black/50 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-between"
              >
                {/* <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Forgot Password?
                </Link> */}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-900/50 hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 text-center text-gray-400"
            >
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </motion.p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 relative hidden md:block">
            <img
              src={cricksalimage}
              alt="Cricksal Background"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 flex items-end justify-center pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center px-8"
              >
                <h3 className="text-blue-400 text-2xl font-bold mb-3">Join the Cricksal Community Today</h3>
                <p className="text-gray-300 text-sm font-medium">Connect with players and venues near you</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;