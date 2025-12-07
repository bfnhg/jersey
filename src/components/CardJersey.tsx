// src/components/card/CardJersey.tsx
"use client";

import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { Product } from "../data/products";
import { ShoppingBag, Eye, Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CardJersey({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, "M", 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const newIndex = Math.round(container.scrollLeft / container.clientWidth);
    setActiveIndex(Math.min(newIndex, product.image_urls.length - 1));
  };

  // Empêche tout clic sur la carte entière (sauf les boutons)
  const preventCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative">
      <CardContainer
        containerClassName="py-8"
        className="cursor-default select-none" // Désactive le pointeur main
      >
        <CardBody
          className="relative w-full max-w-[300px] h-[480px] bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/30 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden"
          onClick={preventCardClick} // Bloque TOUT clic sur la carte
        >
          <div className="h-full flex flex-col relative">
            {/* Badge NEW */}
            {product.is_new && (
              <div className="absolute top-4 right-4 z-50 pointer-events-none">
                <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                  <Sparkles size={13} />
                  NEW
                </div>
              </div>
            )}

            {/* Carrousel d'images */}
            <CardItem translateZ={60} className="w-full h-[260px] relative">
              <div
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide rounded-t-3xl"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onScroll={handleScroll}
              >
                {product.image_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${product.name} - vue ${index + 1}`}
                    className="flex-none w-full h-full object-cover object-top snap-center"
                    draggable={false}
                  />
                ))}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent pointer-events-none" />

              {/* Dots de pagination */}
              {product.image_urls.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                  {product.image_urls.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-6 bg-emerald-400 shadow-lg shadow-emerald-400/50"
                          : "w-1.5 bg-gray-500/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </CardItem>

            {/* Infos produit */}
            <div className="flex-1 px-5 py-4 text-center">
              <CardItem translateZ={30}>
                <h3 className="text-white text-lg font-bold line-clamp-2">
                  {product.name}
                </h3>
              </CardItem>
              <CardItem translateZ={20}>
                <p className="text-emerald-400 text-xs font-medium mt-2 uppercase tracking-wider">
                  {product.category}
                </p>
              </CardItem>
              <CardItem translateZ={40} className="mt-4">
                <p className="text-3xl font-black text-emerald-400">
                  {product.price} <span className="text-lg">MAD</span>
                </p>
                <div className="h-1 w-20 mx-auto mt-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm" />
              </CardItem>
            </div>

            {/* Boutons - SEULS endroits cliquables */}
            <div className="absolute inset-x-4 bottom-4 flex gap-3 z-50">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-red-500/60 transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700" />
                <ShoppingBag size={18} />
                <span>Add</span>
              </button>

              <button
                onClick={handleView}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-emerald-500/60 transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700" />
                <Eye size={18} />
                <span>View</span>
              </button>
            </div>
          </div>
        </CardBody>
      </CardContainer>

      {/* Toast d'ajout au panier */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full mb-4 z-[60] flex items-center gap-3 p-3 rounded-xl shadow-2xl backdrop-blur-md border border-emerald-500/30 bg-gray-900/95 w-[calc(100%-2rem)] max-w-[268px] pointer-events-none"
          >
            <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 flex-shrink-0">
              <Check size={18} strokeWidth={3} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <h4 className="text-white font-bold text-xs">Ajouté au panier !</h4>
              <p className="text-gray-400 text-[10px] mt-0.5 line-clamp-1">
                {product.name}
              </p>
            </div>
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full origin-left"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}