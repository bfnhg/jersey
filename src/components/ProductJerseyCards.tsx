"use client";

import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Heart, ShoppingCart } from "lucide-react";

interface ProductJerseyCardsProps {
  id?: string;
  name?: string;
  team?: string;
  price?: string;
  rating?: number;
  isNew?: boolean;
  imageUrl?: string;
}

export const ProductJerseyCards: React.FC<ProductJerseyCardsProps> = ({
  id = "1",
  name = "Messi #10",
  team = "Inter Miami CF",
  price = "1299.00",
  rating = 4.8,
  isNew = true,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    // Replace with your real cart logic or navigation
    console.log("Added to cart:", name);
    // Example: router.push(`/checkout?product=${id}`)
  };

  return (
    <CardContainer className="inter-var">
      <CardBody className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-800 w-[20rem]">

        {/* NEW Badge */}
        {isNew && (
          <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            NEW
          </div>
        )}

        {/* Like Button */}
        <CardItem translateZ={20}>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black transition-all duration-300 hover:scale-110 shadow-md"
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isLiked
                  ? "fill-red-600 text-red-600 scale-110"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            />
          </button>
        </CardItem>

        {/* Jersey Image Area */}
        <CardItem translateZ={50} className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="w-full h-full flex items-center justify-center">
            {/* Replace this SVG with your real image later if needed */}
            <svg width="180" height="220" viewBox="0 0 220 260" className="drop-shadow-2xl">
              <path d="M70 90h80v140H70z" fill="url(#jersey)" stroke="#111" strokeWidth="3"/>
              <path d="M40 110h30v80H40zM150 110h30v80h-30z" fill="url(#sleeves)" stroke="#111" strokeWidth="3"/>
              <path d="M90 90h40v20H90z" fill="#111"/>
              <text x="110" y="170" fontSize="52" fontWeight="bold" fill="#fff" textAnchor="middle">10</text>
              <defs>
                <linearGradient id="jersey" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff4d6d"/>
                  <stop offset="100%" stopColor="#c77dff"/>
                </linearGradient>
                <linearGradient id="sleeves">
                  <stop offset="0%" stopColor="#ff8c42"/>
                  <stop offset="100%" stopColor="#ffb84d"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Hover zoom effect (fake with scale) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </CardItem>

        {/* Content */}
        <CardItem translateZ={40} className="p-5 space-y-3">
          {/* Category */}
          <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
            Official Jersey
          </span>

          {/* Name */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
            {name}
          </h3>

          {/* Team */}
          <p className="text-sm text-gray-600 dark:text-gray-400">{team}</p>

          {/* Price + Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {price} MAD
            </span>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4" />
              Order
            </button>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};