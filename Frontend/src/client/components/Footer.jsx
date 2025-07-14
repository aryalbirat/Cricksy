import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto max-w-screen-xl px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="font-bold text-3xl text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-4">
                Cricksy
              </h2>
              <p className="text-slate-400 text-base leading-relaxed max-w-md">
                Your premier destination for finding and booking cricket courts. We connect players with top-quality facilities across the region, making it easier than ever to enjoy the game you love.
              </p>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-lg text-white mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                {[
                  { icon: FaFacebook, color: "hover:text-blue-500" },
                  { icon: FaTwitter, color: "hover:text-sky-400" },
                  { icon: FaInstagram, color: "hover:text-pink-500" },
                  { icon: FaLinkedin, color: "hover:text-blue-600" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className={`w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 ${social.color} transition-all duration-300 hover:bg-slate-700/50 hover:border-slate-600/50 hover:scale-110`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-xl text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { to: "/findcricksalcourts", label: "Find Courts" },
                { to: "/mybooking", label: "My Bookings" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/help", label: "Help & Support" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-xl text-white mb-6">
              Contact Us
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Address</p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Balkumari, Lalitpur<br />
                    Nepal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Phone</p>
                  <a 
                    href="tel:9866296119" 
                    className="text-slate-400 hover:text-green-400 transition-colors duration-300 text-sm"
                  >
                    +977 986-629-6119
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Email</p>
                  <a
                    href="mailto:book.at.cricksy@gmail.com"
                    className="text-slate-400 hover:text-purple-400 transition-colors duration-300 text-sm break-all"
                  >
                    book.at.cricksy@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="mt-16 pt-8 border-t border-slate-800/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm text-center md:text-left">
              <p>© 2024 Cricksy. All rights reserved.</p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-slate-500 hover:text-blue-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-500 hover:text-blue-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-slate-500 hover:text-blue-400 transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;