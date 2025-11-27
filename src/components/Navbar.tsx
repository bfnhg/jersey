import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface NavbarProps {
  cartItemCount?: number;
}

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Shop', href: '#shop' },
  
];

export default function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Cacher la navbar quand on scroll down, montrer quand on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -120,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-2"
    >
      <motion.nav
        className={cn(
          "w-full max-w-2xl transition-all duration-300",
          scrolled
            ? "bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-xl shadow-2xl shadow-black/10 border border-green-400/30 rounded-2xl"
            : "bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-lg shadow-lg shadow-black/5 border border-green-300/30 rounded-2xl"
        )}
      >
        <div className="px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between items-center h-14">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 460 }}
              transition={{ duration: 0.8 }}
              className="w-12 h-12 bg-gradient-to-br from-red-700 via-red-600 to-red-600 rounded-lg flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-xl">M</span>
            </motion.div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Morocco Store
            </h3>
          </motion.div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-white font-medium transition-all rounded-lg group"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="relative z-10 transition-colors group-hover:text-green-100">
                  {item.name}
                </span>
                <AnimatePresence>
                  {hoveredItem === item.name && (
                    <motion.div
                      layoutId="hoverBackground"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-white/20 rounded-lg"
                    />
                  )}
                </AnimatePresence>
                {hoveredItem === item.name && (
                  <motion.span
                    layoutId="underline"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 h-0.5 bg-white rounded-full"
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Search className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/20 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2 bg-green-600/50 backdrop-blur-sm">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white hover:text-green-100 font-medium py-2 transition-colors rounded-lg hover:bg-white/20 px-2"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.nav>
    </motion.div>
  );
}
