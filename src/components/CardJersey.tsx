// src/components/CardJersey.tsx
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
  
  // --- NOUVEAU : État pour suivre l'index de l'image visible ---
  const [activeIndex, setActiveIndex] = useState(0); 

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    addToCart(product, "M", 1);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  // --- NOUVEAU : Handler pour l'événement de défilement ---
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollContainer = e.currentTarget;
    const scrollLeft = scrollContainer.scrollLeft;
    const itemWidth = scrollContainer.clientWidth;
    // Calcule l'index de l'image la plus proche du centre
    const newIndex = Math.round(scrollLeft / itemWidth);
    setActiveIndex(newIndex);
  };

  return (
    <>
      <CardContainer containerClassName="py-8">
        <CardBody className="relative w-full max-w-[300px] h-[480px] bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/30 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden pointer-events-none">
          
          {/* Contenu interactif */}
          <div className="pointer-events-auto h-full flex flex-col relative">
            
            {/* Badge NEW */}
            {product.is_new && (
              <div className="absolute top-4 right-4 z-50 pointer-events-none">
                <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                  <Sparkles size={13} />
                  NEW
                </div>
              </div>
            )}

            {/* --- NOUVEAU : Carrousel d'Images --- */}
            {/* La CardItem permet la translation 3D du conteneur */}
            <CardItem translateZ={60} className="w-full h-[260px] relative">
                
                {/* Conteneur de défilement pour les images */}
                <div 
                    className="w-full h-full flex overflow-x-scroll snap-x snap-mandatory scroll-smooth rounded-t-3xl pointer-events-auto"
                    // Masque la barre de défilement sur Chrome/Edge/Safari (overflow-hidden est sur CardBody)
                    style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' /* Firefox */ }}
                    onScroll={handleScroll}
                >
                    {product.image_urls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`${product.name} image ${index + 1}`}
                            // Important: `flex-none` pour éviter le redimensionnement, `w-full` pour prendre la largeur du parent, `snap-center` pour le défilement centré.
                            className="flex-none w-full h-full object-cover object-top snap-center"
                        />
                    ))}
                </div>

                {/* Gradient pour l'esthétique */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent pointer-events-none" />

                {/* Indicateurs de pagination (les petits points) */}
                {product.image_urls.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10">
                        {product.image_urls.map((_, index) => (
                            <div 
                                key={`dot-${index}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === activeIndex ? 'w-5 bg-emerald-400' : 'w-1.5 bg-gray-500/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </CardItem>
            {/* --- FIN NOUVEAU : Carrousel d'Images --- */}

            {/* Infos */}
            <div className="flex-1 px-5 py-4 text-center">
              <CardItem translateZ={30}>
                <h3 className="text-white text-lg font-bold line-clamp-2">{product.name}</h3>
              </CardItem>
              <CardItem translateZ={20}>
                <p className="text-emerald-400 text-xs font-medium mt-2 uppercase tracking-wider">
                  {product.category}
                </p>
              </CardItem>
              <CardItem translateZ={40} className="mt-4">
                <p className="text-emerald-400 text-3xl font-black">
                  {product.price} <span className="text-lg">MAD</span>
                </p>
                <div className="h-1 w-20 mx-auto mt-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm" />
              </CardItem>
            </div>

            {/* BOUTONS */}
            <div className="absolute inset-x-4 bottom-4 flex gap-3 z-50 pointer-events-auto">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-red-500/60 transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                <ShoppingBag size={18} />
                <span>Add</span>
              </button>

              <button
                onClick={handleView}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-emerald-500/60 transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                <Eye size={18} />
                <span>View</span>
              </button>
            </div>
          </div>
        </CardBody>
      </CardContainer>

      {/* --- TOAST INTEGRE EN BAS DE LA CARTE --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            // Animation verticale (glisse vers le haut)
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            
            // Nouveau positionnement : centré, juste sous la carte
            className="relative mx-auto mt-[-20px] z-50 flex items-center gap-4 p-4 rounded-xl shadow-2xl backdrop-blur-md border border-emerald-500/30 bg-gray-900/90 max-w-[300px] w-full pointer-events-none"
          >
            {/* Icône */}
            <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400">
              <Check size={20} strokeWidth={3} />
            </div>

            {/* Texte */}
            <div className="flex flex-col">
              <h4 className="text-white font-bold text-sm leading-tight">
                Ajouté au panier !
              </h4>
              <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                {product.name}
              </p>
            </div>

            {/* Barre de progression (décorative) */}
            <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 2.5, ease: "linear" }}
                className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500/50 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}