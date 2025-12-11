// src/components/Navbar.tsx
"use client";

import { ShoppingCart, Menu, X, Plus, Minus, Trash2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useSearch } from "../hooks/useSearch";
import { Link } from "react-router-dom";
import CardJersey from "./CardJersey";

const navItems = [
  { name: "Accueil", href: "/" },
  { name: "Boutique", href: "/#shop" },
  { name: "Nouveautés", href: "/#new" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { items, getTotalItems, getTotalPrice, updateQuantity, removeFromCart } = useCart();
  const cartItemCount = getTotalItems();

  // RECHERCHE FONCTIONNELLE
  const { query, setQuery, filteredProducts } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY && current > 100) setIsVisible(false);
      else if (current < lastScrollY) setIsVisible(true);
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isCartOpen ? "hidden" : "unset";
  }, [isMenuOpen, isCartOpen]);

  return (
    <>
      {/* ==================== NAVBAR ==================== */}
      <motion.nav
        initial={{ y: -120 }}
        animate={{ y: isVisible ? 0 : -160 }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="fixed inset-x-0 top-5 z-[100] flex justify-center pointer-events-none"
      >
        <div className="w-full max-w-7xl mx-auto px-4 pointer-events-auto">
          <div className="h-16 bg-gradient-to-r from-red-700/95 via-red-800/95 to-red-700/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-500/30">
            <div className="flex items-center justify-between h-full px-5">

              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white text-3xl font-black">M</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white">Morocco Store</h1>
              </div>

              {/* Menu Desktop */}
              <div className="hidden lg:flex items-center gap-10">
                {navItems.map((item) => (
                  <a key={item.name} href={item.href} className="text-white font-semibold hover:text-green-400 transition">
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Recherche + Panier */}
              <div className="flex items-center gap-4">

                {/* BARRE DE RECHERCHE INTERACTIVE */}
                <div className="relative">
                  <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full pl-4 pr-4 h-11 w-64">
                    <Search className="w-5 h-5 text-green-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsSearchOpen(true)}
                      placeholder="Rechercher un maillot..."
                      className="bg-transparent text-white placeholder-white/50 outline-none w-full ml-3"
                    />
                  </div>

                  {/* RÉSULTATS DE RECHERCHE EN TEMPS RÉEL */}
                  <AnimatePresence>
                    {isSearchOpen && query && filteredProducts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 left-0 right-0 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/30 overflow-hidden"
                      >
                        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                          {filteredProducts.slice(0, 6).map((product) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              onClick={() => {
                                setQuery("");
                                setIsSearchOpen(false);
                              }}
                              className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition"
                            >
                              <img src={product.image_urls[0]} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
                              <div>
                                <p className="text-white font-medium">{product.name}</p>
                                <p className="text-green-400 text-sm">{product.price} MAD</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Si rien trouvé */}
                  {isSearchOpen && query && filteredProducts.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-14 left-0 right-0 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 text-center border border-red-500/30"
                    >
                      <p className="text-gray-400">Aucun maillot trouvé pour "{query}"</p>
                    </motion.div>
                  )}
                </div>

                {/* Panier */}
                <button onClick={() => setIsCartOpen(true)} className="relative p-3 rounded-xl hover:bg-white/10 transition">
                  <ShoppingCart className="w-6 h-6 text-white" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </button>

                {/* Menu Mobile */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-3 rounded-xl hover:bg-white/10">
                  {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MENU MOBILE & PANIER (identiques à avant, je te les laisse) */}
      {/* Tu peux garder tout le code du menu mobile et panier que tu avais déjà */}
      {/* Ils sont parfaits */}
    </>
  );
}