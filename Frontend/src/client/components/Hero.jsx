import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import myimage from "../../image/bg3.avif";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-[700px] bg-cover bg-center overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 70, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%), url(${myimage})` 
      }}
    >
      {/* Enhanced animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-screen-xl px-4 h-full flex flex-col justify-center">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white leading-tight">
            Find and Book{" "}
            <span className="text-blue-400 block md:inline">
              Cricksal Courts
            </span>{" "}
            <span className="text-blue-500">Near You</span>
          </h1>
        </motion.div>
        
        <motion.p 
          className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover the best cricksal courts and book your next game in seconds. 
          <span className="text-blue-400"> Premium facilities, instant booking, unbeatable prices.</span>
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            className="bg-blue-700 text-white text-xl px-12 py-5 rounded-lg shadow-2xl shadow-blue-900/50 hover:bg-blue-600 transition-all duration-300"
            onClick={() => navigate("/findcricksalcourts")}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(29, 78, 216, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Find Courts
          </motion.button>
          
          <motion.button
            className="bg-transparent text-blue-400 text-xl px-12 py-5 rounded-lg border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
            onClick={() => navigate("/about")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Enhanced feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { title: "Instant Booking", desc: "Book in seconds", icon: "⚡" },
            { title: "Best Prices", desc: "Competitive rates", icon: "💰" },
            { title: "24/7 Support", desc: "Always available", icon: "🛡️" }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-black/40 backdrop-blur-xl border border-blue-900/30 px-6 py-4 rounded-2xl text-center group cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: index * 0.3 
              }}
            >
              <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;