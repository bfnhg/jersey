// src/pages/ProductDetails.tsx (Modified for Multiple Sizes/Quantities)
import { useState, useMemo } from "react";
import { Truck, Shield, RotateCcw, Check, Star, Heart, Share2, Package, Clock, Award, CreditCard, Banknote, MapPin, User, Phone, Mail, ShoppingBag, Send, Trash2, Plus, Minus } from "lucide-react";

// --- CONFIGURATION WHATSAPP ---
const WHATSAPP_NUMBER = "0624831624"; 
const AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const mockProduct = {
  id: "1",
  name: "Premium Cotton T-Shirt",
  price: 299, // Changed to number for easier calculation
  description: "Experience ultimate comfort with our premium cotton t-shirt. Crafted from 100% organic cotton, this piece combines style with sustainability. Perfect for everyday wear.",
  image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop", // Front View
  back_image_url: "https://images.unsplash.com/photo-1579732115124-ed98c306c29c?w=800&h=800&fit=crop", // Simulated Back View
};

// --- NEW TYPE FOR ORDER LINES ---
interface OrderLine {
    size: string;
    quantity: number;
}
// ---------------------------------

export default function ProductDetails() {
  const product = mockProduct;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cash", 
  });

  // --- NEW STATE FOR MULTI-SIZE CART ---
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [tempSize, setTempSize] = useState<string>("M");
  const [tempQuantity, setTempQuantity] = useState<number>(1);
  // -------------------------------------

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- CALCULATE TOTAL PRICE ---
  const totalPrice = useMemo(() => {
    return orderLines.reduce((sum, line) => sum + line.quantity * product.price, 0);
  }, [orderLines, product.price]);
  // -----------------------------

  // --- HANDLERS FOR ORDER LINES ---

  const handleAddLine = () => {
      if (tempQuantity < 1) return;
      
      setOrderLines(prevLines => {
          const existingLine = prevLines.find(line => line.size === tempSize);

          if (existingLine) {
              // Update quantity if size exists
              return prevLines.map(line => 
                  line.size === tempSize ? { ...line, quantity: line.quantity + tempQuantity } : line
              );
          } else {
              // Add new line
              return [...prevLines, { size: tempSize, quantity: tempQuantity }];
          }
      });
      // Reset temp quantity after adding
      setTempQuantity(1);
  };

  const handleUpdateQuantity = (size: string, delta: number) => {
    setOrderLines(prevLines => {
        const newLines = prevLines.map(line => {
            if (line.size === size) {
                const newQuantity = line.quantity + delta;
                return newQuantity > 0 ? { ...line, quantity: newQuantity } : null;
            }
            return line;
        }).filter((line): line is OrderLine => line !== null); // Filter out lines with 0 quantity

        return newLines;
    });
  };

  const handleRemoveLine = (size: string) => {
      setOrderLines(prevLines => prevLines.filter(line => line.size !== size));
  };

  // --- WHATSAPP SUBMISSION LOGIC ---

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Validation
    if (orderLines.length === 0) {
        alert("Please add at least one item to your order before submitting.");
        return;
    }
    if (!form.firstName || !form.lastName || !form.phone || !form.address || !form.city) {
        alert("Please fill in all required personal and delivery fields (Name, Phone, Address, City).");
        return;
    }

    setIsSubmitting(true);

    // --- 1. CONSTRUCT WHATSAPP MESSAGE ---
    const orderDetails = orderLines.map(line => 
        ` - ${line.quantity}x ${product.name} (Size: ${line.size})`
    ).join('\n');

    const message = `
*--- NEW MULTI-SIZE ORDER CONFIRMATION ---*
Total Price: ${totalPrice} MAD
Payment Method: Cash on Delivery

*--- ORDER ITEMS (${orderLines.length} line(s)) ---*
${orderDetails}

*--- CUSTOMER DETAILS ---*
Name: ${form.firstName} ${form.lastName}
Phone: ${form.phone}
Email: ${form.email || 'N/A'}

*--- DELIVERY ADDRESS ---*
Address: ${form.address}, ${form.city}
Postal Code: ${form.postalCode || 'N/A'}
`;

    // Encode the message for the URL
    const encodedMessage = encodeURIComponent(message.trim());
    
    // Construct the WhatsApp URL
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // --- 2. OPEN WHATSAPP ---
    try {
        window.open(whatsappUrl, '_blank'); 

        setSubmitSuccess(true);
        setIsSubmitting(false);

        // Reset form and order lines after a short delay
        setTimeout(() => {
            setSubmitSuccess(false);
            setOrderLines([]); // Clear the cart
            setForm({ 
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                postalCode: "",
                paymentMethod: "cash",
            });
        }, 3000);

    } catch (error) {
        console.error("Failed to open WhatsApp:", error);
        setIsSubmitting(false);
        alert("Error: Could not open WhatsApp. Please check your browser settings or try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-950/90 text-white relative overflow-hidden">
      {/* ... (Header and Animated Background remain the same) ... */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Product Details</h1>
              <p className="text-sm text-gray-400 mt-1">Discover premium quality and style</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isLiked ? "bg-red-600 text-white shadow-lg shadow-red-500/50" : "bg-gray-800 text-gray-400 hover:bg-gray-700 shadow-md"}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 shadow-md transition-all duration-300 transform hover:scale-110">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column (Image, Thumbnails, Features - mostly unchanged) */}
          <div className="flex flex-col justify-start space-y-6">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl opacity-20 group-hover:opacity-30 blur-2xl transition-all duration-700 animate-pulse" />
              
              <div 
                className="relative transform transition-all duration-700 group-hover:scale-[1.02]" 
                style={{ transformStyle: 'preserve-3d' }}
                onMouseEnter={() => product.back_image_url && setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
              >
                <div 
                    className={`relative w-full aspect-square rounded-3xl shadow-2xl transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <img
                      src={product.image_url}
                      alt={`${product.name} Front`}
                      className={`absolute inset-0 w-full h-full object-cover rounded-3xl backface-hidden transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                      style={{ transform: 'translateZ(0)' }}
                    />
                    {product.back_image_url && (
                        <img
                            src={product.back_image_url}
                            alt={`${product.name} Back`}
                            className={`absolute inset-0 w-full h-full object-cover rounded-3xl backface-hidden transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
                            style={{ transform: 'rotateY(180deg) translateZ(0)' }}
                        />
                    )}
                </div>
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transform hover:scale-110 transition-all duration-300 z-20">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Hover to Flip
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 aspect-square group/thumb transform hover:-translate-y-2 ${selectedImage === i ? "ring-4 ring-emerald-500 shadow-2xl shadow-emerald-500/50 scale-105" : "hover:shadow-xl"}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent z-10 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300" />
                  <img
                    src={product.image_url}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover group-hover/thumb:scale-125 transition-transform duration-700"
                  />
                  {selectedImage === i && (
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-2xl z-20" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, text: "Fast Delivery", color: "from-emerald-500 to-teal-500" },
                { icon: Shield, text: "Secure Payment", color: "from-red-500 to-pink-500" },
                { icon: RotateCcw, text: "Easy Return", color: "from-cyan-500 to-blue-500" }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="relative group/card transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-10 group-hover/card:opacity-20 transition-opacity duration-300`} />
                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-500/20"> 
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 mx-auto shadow-lg`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-gray-200 text-center">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info & Form */}
          <div className="flex flex-col space-y-6">
            {/* Product Info Card (Unchanged) */}
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-500/20 p-8 transform hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/50">
                  ✓ In Stock
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-400 ml-2">(128 reviews)</span>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-4 mb-6 bg-gradient-to-r from-gray-800 to-gray-800/90 rounded-2xl p-6 border-2 border-emerald-500/20">
                <span className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {product.price}
                </span>
                <span className="text-2xl font-bold text-gray-400">MAD</span>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-800 rounded-xl p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-5 h-5 text-red-400" />
                    <span className="text-xs font-semibold text-gray-400">Stock Status</span>
                  </div>
                  <p className="text-lg font-bold text-white">Available Now</p>
                </div>
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-800 rounded-xl p-4 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-semibold text-gray-400">Delivery</span>
                  </div>
                  <p className="text-lg font-bold text-white">2-3 Days</p>
                </div>
              </div>
            </div>

            {/* Order Form Card */}
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-500/20 p-8">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <Package className="w-7 h-7 text-emerald-400" />
                Complete Your Order
              </h3>
              
              <div className="space-y-6">
                
                {/* --- MULTI-SIZE SELECTION / ADD TO CART --- */}
                <div className="border-b-2 border-gray-800 pb-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-400" />
                    Add Item to Cart
                  </h4>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                      {AVAILABLE_SIZES.map((sizeOption) => (
                          <button
                              key={sizeOption}
                              type="button"
                              onClick={() => setTempSize(sizeOption)}
                              className={`py-2 px-2 rounded-xl font-bold transition-all duration-300 text-sm ${
                                  tempSize === sizeOption
                                      ? "bg-red-600 text-white shadow-xl shadow-red-500/50"
                                      : "bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-red-500 hover:bg-gray-700"
                              }`}
                          >
                              {sizeOption}
                          </button>
                      ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-2 border-2 border-gray-700 flex-grow">
                      <button
                        type="button"
                        onClick={() => setTempQuantity(Math.max(1, tempQuantity - 1))}
                        className="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-700 hover:border-emerald-500 hover:bg-gray-800 font-bold text-gray-200 transition-all duration-300 flex items-center justify-center"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="flex-1 text-center text-xl font-black text-white">{tempQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setTempQuantity(tempQuantity + 1)}
                        className="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-700 hover:border-emerald-500 hover:bg-gray-800 font-bold text-gray-200 transition-all duration-300 flex items-center justify-center"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddLine}
                        className="flex-shrink-0 py-3 px-6 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-500/50 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        Add to Cart
                    </button>
                  </div>
                </div>
                {/* --- END MULTI-SIZE SELECTION / ADD TO CART --- */}

                {/* --- CART SUMMARY --- */}
                <div className="border-b-2 border-gray-800 pb-6">
                    <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-400" />
                        Your Cart ({orderLines.length} items)
                    </h4>
                    
                    {orderLines.length === 0 ? (
                        <div className="text-center py-4 bg-gray-800/50 rounded-xl text-gray-400 font-semibold">
                            Your cart is empty. Add a size and quantity above!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orderLines.map((line) => (
                                <div key={line.size} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-gray-700">
                                    <div className="flex-1">
                                        <p className="font-bold text-white">{product.name} - Size: {line.size}</p>
                                        <p className="text-xs text-gray-400">{line.quantity} x {product.price} MAD</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Quantity control in cart */}
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateQuantity(line.size, -1)}
                                            className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center justify-center"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="font-bold text-white w-4 text-center">{line.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateQuantity(line.size, 1)}
                                            className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center justify-center"
                                        >
                                            <Plus size={14} />
                                        </button>
                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveLine(line.size)}
                                            className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white ml-2 flex items-center justify-center transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* --- END CART SUMMARY --- */}


                {/* Personal Information Section (Unchanged) */}
                <div className="border-t-2 border-gray-800 pt-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-400" />
                    Personal Information <span className="text-red-400 text-xs ml-2">(Required)</span>
                  </h4>
                  {/* ... (First Name, Last Name, Email, Phone inputs remain the same) ... */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input type="text" id="firstName" name="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required placeholder=" " className="peer w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label htmlFor="firstName" className="absolute left-4 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">First Name</label>
                    </div>

                    <div className="relative">
                      <input type="text" id="lastName" name="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required placeholder=" " className="peer w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label htmlFor="lastName" className="absolute left-4 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Last Name</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 peer-focus:text-emerald-400 z-10" />
                      <input type="email" id="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder=" " className="peer w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label htmlFor="email" className="absolute left-12 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:left-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Email Address (Optional)</label>
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 peer-focus:text-emerald-400 z-10" />
                      <input type="tel" id="phone" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder=" " className="peer w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label htmlFor="phone" className="absolute left-12 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:left-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Phone Number</label>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Section (Required indicators added) */}
                <div className="border-t-2 border-gray-800 pt-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    Delivery Address <span className="text-red-400 text-xs ml-2">(Required)</span>
                  </h4>
                  
                  <div className="relative mb-4">
                    <textarea id="address" name="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder=" " rows={3} className="peer w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300 resize-none"/>
                    <label htmlFor="address" className="absolute left-4 top-4 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Street Address</label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input type="text" id="city" name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required placeholder=" " className="peer w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label htmlFor="city" className="absolute left-4 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">City</label>
                    </div>

                    <div className="relative">
                      <input type="text" id="postalCode" name="postalCode" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder=" " className="peer w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label htmlFor="postalCode" className="absolute left-4 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Postal Code (Optional)</label>
                    </div>
                  </div>
                </div>

                {/* Payment Method Section (COD ONLY - Unchanged) */}
                <div className="border-t-2 border-gray-800 pt-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-400" />
                    Payment Method
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      key="cash"
                      type="button"
                      className={`relative p-4 rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-gray-800 to-gray-800/90 shadow-lg text-left group cursor-default`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg`}>
                          <Banknote className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white mb-0.5">Cash on Delivery (COD)</p>
                          <p className="text-xs text-gray-400">Pay when you receive your package.</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center transition-all duration-300`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Currently, **Cash on Delivery** is the only available payment method.</p>
                  </div>
                </div>

                {/* Final Price and Submit Button */}
                <div className="border-t-2 border-gray-800 pt-6 space-y-4">
                  <div className="flex justify-between items-center bg-gray-800 rounded-xl p-4 border-2 border-gray-700">
                    <p className="text-lg font-bold text-gray-200">Total Price:</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                      {totalPrice} <span className="text-xl">MAD</span>
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || submitSuccess || orderLines.length === 0}
                    className={`
                      w-full flex items-center justify-center gap-3
                      py-4 rounded-xl 
                      shadow-2xl font-black text-lg
                      transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
                      relative overflow-hidden group/btn
                      ${
                        submitSuccess
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/50 cursor-not-allowed"
                          : isSubmitting
                          ? "bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-red-400/50 cursor-wait"
                          : orderLines.length === 0
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed" // Disabled style
                          : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-600/40 hover:shadow-red-500/60"
                      }
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    {submitSuccess ? (
                      <Check size={20} className="relative z-10" />
                    ) : isSubmitting ? (
                      <span className="relative z-10">Preparing WhatsApp...</span>
                    ) : orderLines.length === 0 ? (
                        <span className="relative z-10">Add items to cart to order</span>
                    ) : (
                      <>
                        <Send size={20} className="relative z-10 group-hover/btn:rotate-6 transition" />
                        <span className="relative z-10">
                          Send Order via WhatsApp
                        </span>
                      </>
                    )}
                  </button>

                  {submitSuccess && (
                    <p className="text-center text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      WhatsApp chat opened successfully! Please confirm the message.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}