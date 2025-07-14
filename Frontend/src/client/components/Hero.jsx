import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, DollarSign, Shield } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Cricket Ground Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.85) 30%, rgba(15, 23, 42, 0.95) 70%, rgba(0, 0, 0, 0.98) 110%), url('https://images.pexels.com/photos/31739439/pexels-photo-31739439.jpeg')`
        }}
      />

      {/* Subtle animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl px-6 lg:px-8 h-full flex flex-col justify-center py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900/40 border border-blue-800/40 mb-6 backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-blue-300">Premium Courts Available</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Find & Book{" "}
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                  Cricket Courts
                </span>
                <br />
                <span className="text-gray-200">Near You</span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-gray-300 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover premium cricket courts and book your next game instantly. 
              Professional facilities, competitive pricing, and seamless booking experience.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.button
                className="group bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 hover:from-blue-600 hover:via-blue-500 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 border border-blue-600/20"
                onClick={() => navigate("/findcricksalcourts")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Find Courts Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                className="group bg-transparent border-2 border-blue-500/60 text-blue-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-800/20 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                onClick={() => navigate("/about")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Feature Cards */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Instant Booking",
                description: "Book your favorite courts in seconds with our streamlined process",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                title: "Best Prices",
                description: "Competitive rates and exclusive deals for premium facilities",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your booking needs",
                color: "from-purple-500 to-indigo-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom stats section */}
        <motion.div
          className="mt-16 pt-8 border-t border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Courts Available" },
              { number: "10K+", label: "Happy Players" },
              { number: "25+", label: "Cities Covered" },
              { number: "4.9", label: "Average Rating" }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;