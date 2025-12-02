import { ShoppingCart, Menu, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const navItems = [
  { name: 'Accueil', href: '#home' },
  { name: 'Boutique', href: '#shop' },
  { name: 'Nouveautés', href: '#new' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { items, getTotalItems, getTotalPrice, updateQuantity, removeFromCart } = useCart();

  // Effet pour masquer/afficher la barre de navigation au défilement
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

  // Effet pour bloquer le défilement du corps (body) lorsque le menu ou le panier est ouvert
  useEffect(() => {
    if (isCartOpen || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, isMenuOpen]);

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -150 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4"
      >
        <div className="w-full max-w-6xl bg-gradient-to-r from-red-700/95 to-red-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-400/30">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-green-600 rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-white text-2xl font-black">M</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Morocco Store</h1>
            </div>

            {/* Desktop Menu (Visible seulement sur grand écran) */}
            <div className="hidden lg:flex gap-10">
              {navItems.map(item => (
                <a key={item.name} href={item.href} className="text-white font-medium hover:text-green-300 transition">
                  {item.name}
                </a>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              {/* Bouton Panier */}
              <button
                onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }}
                className="relative p-3 hover:bg-white/20 rounded-xl transition"
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </button>

              {/* Bouton Menu Mobile (Visible seulement sur petit écran) */}
              <button 
                onClick={() => { setIsMenuOpen(!isMenuOpen); setIsCartOpen(false); }} 
                className="lg:hidden p-3 hover:bg-white/20 rounded-xl"
              >
                {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* -------------------- MENU MOBILE SIDEBAR -------------------- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            />

            {/* Panneau du Menu - Largeur réduite à w-[70%] pour mobile */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[70%] max-w-sm bg-gradient-to-b from-red-800 to-red-900 z-[95] flex flex-col shadow-2xl lg:hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-end">
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-7 h-7 text-white" />
                </button>
              </div>

              <div className="flex flex-col p-6 space-y-4">
                {navItems.map(item => (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-2xl font-semibold p-4 hover:bg-red-700/50 rounded-xl transition block"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              
              <div className="mt-auto p-6 text-center text-gray-300 border-t border-white/10">
                <p>&copy; 2024 Morocco Store</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* -------------------- PANIER SIDEBAR -------------------- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]"
            />

            {/* Panneau du Panier - Largeur ajustée à max-w-md pour mobile */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black z-[115] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="text-green-400" />
                  Panier ({getTotalItems()})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-7 h-7 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-400">Votre panier est vide</p>
                  </div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={`${item.id}-${item.selectedSize}`}
                      layout
                      className="bg-white/5 rounded-2xl p-5 border border-white/10"
                    >
                      <div className="flex gap-4">
                        {/* CORRECTION DE TYPE : Utilisation de item.image_urls[0] */}
                        <img 
                            src={item.image_urls[0]} 
                            alt={item.name} 
                            className="w-24 h-24 object-cover rounded-xl" 
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">{item.name}</h3>
                          <p className="text-green-400">Taille: <strong>{item.selectedSize}</strong></p>
                          {item.is_new && <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">NOUVEAU</span>}
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.selectedSize)}>
                          <Trash2 className="w-5 h-5 text-red-400 hover:text-red-300" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center bg-white/10 rounded-xl text-white">
                          <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} className="p-3 hover:bg-red-500/20 rounded-l-xl">
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-12 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} className="p-3 hover:bg-green-500/20 rounded-r-xl">
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-green-400 font-bold text-xl">
                          {(item.price * item.quantity).toLocaleString()} MAD
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-white/10 p-6 bg-black/70">
                  <div className="flex justify-between text-2xl font-bold mb-6">
                    <span className="text-white">Total</span>
                    <span className="text-green-400">{getTotalPrice().toLocaleString()} MAD</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-5 rounded-2xl font-bold text-xl transition shadow-lg">
                    Passer la commande
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}