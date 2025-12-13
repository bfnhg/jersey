import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-red-900 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-white to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold">Morocco Store</span>
            </div>
            <p className="text-gray-300 mb-6">
              Your premier destination for authentic Morocco national team jerseys and merchandise.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-red-600 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-red-600 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-red-600 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-300 hover:text-red-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#shop" className="text-gray-300 hover:text-red-400 transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#collection" className="text-gray-300 hover:text-red-400 transition-colors">
                  Collections
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-red-400 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">Casablanca, Morocco</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">+212 123 456 789</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">info@moroccostore.ma</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Morocco Store. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}