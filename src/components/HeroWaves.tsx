"use client";

import { motion } from "framer-motion";
import { ShoppingBag ,MessageCircle} from "lucide-react";
import { WavyBackground } from "./ui/wavy-background";

export default function HeroWaves() {
  const handleScrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWhatsAppContact = () => {
    // Remplace ce numéro par le tien (format international sans + ni espaces)
    const phoneNumber = "212624831624"; // ← Mets ton numéro marocain ici, ex: 212661234567
    const message = encodeURIComponent("Bonjour ! Je suis intéressé par vos maillots Maroc 2025 🇲🇦");
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  return (
    <WavyBackground
      waveWidth={50}
      blur={2}
      speed="fast"
      waveOpacity={0.3}
      colors={[
        "#ffffff",
        "#b91c1c", // red-700
        "#15803d", // green-700
      ]}
      backgroundFill="#000000"
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
          <span className="px-5 py-2 bg-white/10 border border-white/20 text-white text-sm font-medium uppercase tracking-widest rounded-full backdrop-blur-xl shadow-lg">
            New 2025 Morocco Edition
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-6xl md:text-7xl font-bold leading-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-green-500 drop-shadow-[0_2px_20px_rgba(220,38,38,0.5)]">
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
          {/* Bouton principal : Shop Now */}
          <button
            onClick={handleScrollToProducts}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/50 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>

          {/* Bouton secondaire */}
         {/* Bouton secondaire : Contact WhatsApp → Hover en ROUGE */}
{/* Bouton WhatsApp : Vert → Rouge au hover, icône toujours visible */}
<button
  onClick={handleWhatsAppContact}
  className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/50 hover:scale-105 flex items-center justify-center gap-3"
>
  {/* Icône WhatsApp - toujours blanche et bien visible */}
  <MessageCircle className="w-6 h-6 text-white z-10" />

  <span className="relative z-10">Contactez-nous sur WhatsApp</span>

  {/* Couche qui passe en ROUGE au hover */}
  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

  {/* Effet de brillance qui traverse au hover */}
  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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