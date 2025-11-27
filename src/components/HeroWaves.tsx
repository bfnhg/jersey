"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import {WavyBackground} from "./ui/wavy-background"; // adjust the path

export default function HeroWaves() {
  return (
    <WavyBackground
      waveWidth={60}
      blur={4}
      speed="fast"
      waveOpacity={0.4}
      colors={[
        "#b91c1c", // deep red
        "#22c55e", // Moroccan green
        "#ffffff", // white
        "#991b1b", // darker red
      ]}
      backgroundFill="#111827"
      className="relative z-10"
      containerClassName="h-screen flex items-center justify-center"
    >
      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center px-6 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <span className="px-5 py-2 bg-white/10 border border-white/20 text-white text-sm uppercase tracking-widest rounded-full backdrop-blur-lg">
            New 2025 Morocco Edition
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-6xl md:text-7xl font-bold leading-tight text-white"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-white to-green-400">
            Morocco Jerseys
          </span>
          <br />
          <span className="text-5xl md:text-6xl">Limited Edition Store</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 mt-6 mb-10 max-w-2xl mx-auto"
        >
          Premium Atlas Lions jerseys inspired by national pride, crafted with
          unmatched quality for true supporters.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <button className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-red-500/40 hover:shadow-xl">
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <button className="px-8 py-4 border border-white/30 text-white rounded-lg hover:bg-white/10 transition">
            Explore Collection
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="flex justify-center gap-12 text-white/80 mt-14"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-sm uppercase tracking-wide">Happy Fans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">100%</div>
            <div className="text-sm uppercase tracking-wide">Authentic</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-sm uppercase tracking-wide">Support</div>
          </div>
        </motion.div>
      </motion.div>
    </WavyBackground>
  );
}
