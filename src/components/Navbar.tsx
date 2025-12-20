// src/components/Navbar.tsx
import { ShoppingCart, Menu, X, Plus, Minus, Trash2, Send, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useSearch } from '../hooks/useSearch';
import { Link } from "react-router-dom";

import { PlaceholdersAndVanishInput } from './ui/PlaceholdersAndVanishInput';

const navItems = [
  { name: 'Home', href: '#home' },
  
  { name: 'Products', href: '#products' },
  { name: 'Features', href: '#features' },
  { name: 'Testimonials', href: '#testimonials' },
  // { name: 'Contact', href: '#contact' },
];

const searchPlaceholders = [
  "Rechercher un maillot...",
  "Cherchez par couleur...",
  "Par taille...",
  "Par prix...",
  "Explorez nos collections..."
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  const { items, getTotalItems, getTotalPrice, updateQuantity, removeFromCart } = useCart();
  const { query, setQuery, filteredProducts } = useSearch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = () => {
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Validation du numéro de téléphone (format Maroc)
    const phoneRegex = /^(\+212|0)[1-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      alert('Veuillez entrer un numéro de téléphone valide (ex: +212612345678 ou 0612345678)');
      return;
    }

    // Créer la commande
    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address
      },
      items: items,
      total: getTotalPrice(),
      date: new Date().toISOString()
    };

    console.log('Commande soumise:', orderData);
    alert(`Merci ${formData.firstName}! Votre commande a été créée avec succès.\nTotal: ${getTotalPrice().toLocaleString()} MAD`);

    // Réinitialiser le formulaire et fermer le modal
    setFormData({ firstName: '', lastName: '', phone: '', address: '' });
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    // Vider le panier - créer une copie pour éviter la mutation
    const itemsToRemove = [...items];
    itemsToRemove.forEach(item => removeFromCart(item.id, item.selectedSize));
  };

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
    if (isCartOpen || isMenuOpen || isCheckoutOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen, isMenuOpen, isCheckoutOpen]);

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

            {/* BARRE DE RECHERCHE */}
            <div className="relative">
                  <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full pl-3 pr-3 h-10 w-32 sm:w-64 sm:h-11 sm:pl-4 sm:pr-4">
  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onFocus={() => setIsSearchOpen(true)}
    placeholder="Rechercher..."
    className="bg-transparent text-white placeholder-white/50 outline-none w-full ml-2 text-xs sm:text-base sm:ml-3"
  />
</div>
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

      {/* DROPDOWN RÉSULTATS RECHERCHE */}
      <AnimatePresence>
        {query.trim() && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[105] w-full max-w-lg bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl max-h-96 overflow-y-auto"
          >
            <div className="p-4 space-y-3">
              {filteredProducts.map((product: any) => (
                <a
                  key={product.id}
                  href={`#products`}
                  onClick={() => {
                    setQuery('');
                    // Optionnel: scroll to product or add to cart
                  }}
                  className="flex gap-4 p-3 rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <img
                    src={product.image_urls?.[0] || '/placeholder.webp'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{product.name}</h4>
                    <p className="text-green-400 text-sm font-bold">{product.price.toLocaleString()} MAD</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    onClick={() => setIsCheckoutOpen(true)}
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

      {/* MODAL CHECKOUT */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-black/50 z-[200]"
            />
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[201]"
            >
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl shadow-2xl border border-white/10 p-8 mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Send className="w-6 h-6 text-green-400" />
                    Finalisez votre commande
                  </h3>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Résumé commande */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <p className="text-gray-300 text-sm mb-2">
                    Articles: <span className="text-green-400 font-bold">{getTotalItems()}</span>
                  </p>
                  <p className="text-white text-xl font-bold">
                    Total: <span className="text-green-400">{getTotalPrice().toLocaleString()} MAD</span>
                  </p>
                </div>

                {/* Formulaire */}
                <form className="space-y-5 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Prénom</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:bg-white/15 transition"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Nom</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:bg-white/15 transition"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:bg-white/15 transition"
                      placeholder="+212 6 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Adresse</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:bg-white/15 transition resize-none"
                      placeholder="Rue, numéro, ville, code postal..."
                    />
                  </div>
                </form>

                {/* Boutons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitOrder}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-3 rounded-xl font-semibold shadow-lg transition"
                  >
                    Confirmer la commande
                  </motion.button>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                  Vos données seront traitées de manière sécurisée 🔒
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}