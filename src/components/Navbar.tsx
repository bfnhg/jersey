// src/components/Navbar.tsx
import { ShoppingCart, Menu, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const navItems = [
  { name: 'Home', href: '#home' },
  
  { name: 'Products', href: '#products' },
  { name: 'Features', href: '#features' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { items, getTotalItems, getTotalPrice, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    console.log("🛒 Panier → Articles différents :", items.length, "| Unités totales :", getTotalItems());
  }, [items]);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY && current > 100) setIsVisible(false);
      else if (current < lastScrollY) setIsVisible(true);
      setLastScrollY(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isCartOpen || isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen, isMenuOpen]);

  return (
    <>
      {/* NAVBAR PRINCIPALE */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -150 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-6xl bg-gradient-to-r from-red-700/95 to-red-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-400/30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-green-600 rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-white text-2xl font-black">M</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Morocco Store</h1>
            </div>
            <div className="hidden lg:flex gap-10">
              {navItems.map(item => (
                <a key={item.name} href={item.href} className="text-white font-medium hover:text-green-300 transition">
                  {item.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="relative p-3 hover:bg-white/20 rounded-xl transition">
                <ShoppingCart className="w-6 h-6 text-white" />
                {getTotalItems() > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {getTotalItems()}
                  </motion.span>
                )}
              </button>
              <button onClick={() => { setIsMenuOpen(!isMenuOpen); setIsCartOpen(false); }} className="lg:hidden p-3 hover:bg-white/20 rounded-xl transition">
                {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-[70%] max-w-sm bg-gradient-to-b from-red-800 to-red-900 z-[95] flex flex-col shadow-2xl lg:hidden">
              <div className="p-6 border-b border-white/10 flex justify-end">
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-7 h-7 text-white" />
                </button>
              </div>
              <div className="flex flex-col p-6 space-y-4 flex-1">
                {navItems.map(item => (
                  <a key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-white text-2xl font-semibold p-4 hover:bg-red-700/50 rounded-xl transition">
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="p-6 text-center text-gray-300 border-t border-white/10">
                <p>© 2025 Morocco Store</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PANIER SIDEBAR */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-gradient-to-b from-gray-900 to-black z-[115] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header - Fixed */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="text-green-400" />
                  Panier ({getTotalItems()})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition">
                  <X className="w-7 h-7 text-white" />
                </button>
              </div>

              {/* Contenu Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                    <p className="text-xl text-gray-400">Votre panier est vide</p>
                  </div>
                ) : (
                  <>
                    {items.map(item => (
                      <motion.div key={`${item.id}-${item.selectedSize}`} layout className="bg-white/5 rounded-2xl p-5 border border-white/10">
                        <div className="flex gap-4">
                          <img 
                            src={item.image_urls?.[0] || '/placeholder.webp'} 
                            alt={item.name} 
                            className="w-24 h-24 object-cover rounded-xl shadow-md" 
                            loading="lazy"
                            onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23666" width="100" height="100"/%3E%3C/svg%3E'; }}
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">{item.name}</h3>
                            <p className="text-green-400 mt-1">Taille: <strong>{item.selectedSize}</strong></p>
                            {item.is_new && <span className="inline-block mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded-full">NOUVEAU</span>}
                          </div>
                          <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="self-start p-1 hover:bg-red-500/20 rounded transition">
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-5">
                          <div className="flex items-center bg-white/10 rounded-xl">
                            <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} className="p-3 hover:bg-red-500/20 rounded-l-xl transition">
                              <Minus className="w-5 h-5 text-white" />
                            </button>
                            <span className="w-12 text-center font-bold text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} className="p-3 hover:bg-green-500/20 rounded-r-xl transition">
                              <Plus className="w-5 h-5 text-white" />
                            </button>
                          </div>
                          <p className="text-green-400 font-bold text-xl">
                            {(item.price * item.quantity).toLocaleString()} MAD
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer - Fixed au bas */}
              {items.length > 0 && (
                <div className="shrink-0 mt-auto p-6 border-t border-white/20 bg-gradient-to-b from-gray-900/50 to-black/80">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-green-400">
                      {getTotalPrice().toLocaleString()} MAD
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-red-600 to-green-600 hover:from-red-500 hover:to-green-500 
                               text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300"
                    onClick={() => alert('Redirection vers le paiement...')}
                  >
                    Passer la commande
                  </motion.button>

                  <p className="text-center text-gray-400 text-sm mt-4">
                    Livraison rapide partout au Maroc 🇲🇦
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}