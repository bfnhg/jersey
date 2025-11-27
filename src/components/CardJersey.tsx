// src/components/CardJersey.tsx
"use client";

import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { Product } from "../data/products";
import { ShoppingBag, Eye, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CardJersey({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();        // ← Empêche la navigation
    e.stopPropagation(); 
    // Nouvelle façon d'appeler addToCart → 3 paramètres séparés
  addToCart(product, "M", 1);      // ← Très important !
    
    
  };

  return (
    <CardContainer className="cursor-pointer" containerClassName="py-5">
      {/* TOUTE LA CARTE EST CLIQUABLE → va vers la page produit */}
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="block h-full group"
      >
        <CardBody className="
          relative
          bg-gradient-to-br from-gray-900/90 to-gray-950/90
          backdrop-blur-xl 
          rounded-3xl p-0 
          border border-emerald-500/20 
          shadow-2xl shadow-emerald-500/10
          w-full max-w-[300px] h-[480px]
          flex flex-col
          transition-all duration-500
          group-hover:shadow-emerald-500/30
          group-hover:border-emerald-500/40
        ">
          {/* Effet glowing au hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Badge New */}
          {product.is_new && (
            <CardItem translateZ={80} className="absolute top-4 right-4 z-10">
              <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                <Sparkles size={13} />
                NEW
              </div>
            </CardItem>
          )}

          {/* Image */}
          <CardItem translateZ={60} className="relative w-full h-[260px] overflow-hidden rounded-t-3xl">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          </CardItem>

          {/* Infos produit */}
          <div className="flex flex-col flex-1 px-5 py-4 text-center">
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

            <CardItem translateZ={35} className="mt-4">
              <p className="text-emerald-400 text-3xl font-black">
                {product.price} <span className="text-lg">MAD</span>
              </p>
              <div className="h-1 w-20 mx-auto mt-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm" />
            </CardItem>
          </div>

          {/* Boutons */}
          <div className="mt-auto flex gap-3 px-4 pb-4">
            {/* Bouton ADD TO CART */}
            <CardItem translateZ={25} className="flex-1">
            <button
  onClick={handleAddToCart}
  className="
    w-full flex items-center justify-center gap-2
    bg-gradient-to-r from-red-600 to-red-700
    hover:from-red-500 hover:to-red-600
    text-white py-3.5 rounded-xl 
    shadow-lg shadow-red-600/40 hover:shadow-red-500/60
    font-semibold text-sm
    transition-all duration-300 hover:scale-105 active:scale-95
    relative overflow-hidden group/btn
  "
>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
  <ShoppingBag size={17} className="relative z-10 group-hover/btn:rotate-12 transition" />
  <span className="relative z-10">Add</span>
</button>
            </CardItem>

            {/* Bouton VIEW → va vers la page produit */}
            <CardItem translateZ={25} className="flex-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-gradient-to-r from-emerald-600 to-emerald-700
                  hover:from-emerald-500 hover:to-emerald-600
                  text-white py-3.5 rounded-xl 
                  shadow-lg shadow-emerald-600/40 hover:shadow-emerald-500/60
                  font-semibold text-sm
                  transition-all duration-300 hover:scale-105 active:scale-95
                  relative overflow-hidden group/btn
                "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <Eye size={17} className="relative z-10 group-hover/btn:scale-110 transition" />
                <span className="relative z-10">View</span>
              </button>
            </CardItem>
          </div>
        </CardBody>
      </div>
    </CardContainer>
  );
}