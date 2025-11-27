import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-brfrom-gray-900 to-black ">
     

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 max-w-6xl mx-auto"
      >
        {/* Badge en haut */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 inline-block"
        >
          {/* <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">
              Official Morocco Collection
            </span>
          </div> */}
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-white to-green-400">
            Atlas Lions
          </span>
          <br />
          <span className="text-5xl md:text-7xl">Jersey Store</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
        >
          Wear the pride of Morocco. Premium quality jerseys inspired by the legendary Atlas Lions.
        </motion.p>

        {/* Boutons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Shop Collection
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </motion.button>
        </motion.div>

        {/* Stats en bas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex justify-center gap-12 text-white/80"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-sm uppercase tracking-wide">Happy Fans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-sm uppercase tracking-wide">Authentic</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm uppercase tracking-wide">Support</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, repeat: Infinity, repeatType: 'reverse', duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}