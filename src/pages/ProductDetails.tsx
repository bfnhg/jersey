"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Truck, Shield, RotateCcw, Check, Star, Heart, Share2,
  Package, Award, Banknote, MapPin, User, Phone, Mail,
  ShoppingBag, Send, Trash2, Plus, Minus, ChevronLeft, ChevronRight, Zap
} from "lucide-react";

import { products, Product } from "../data/products";

// --- CONFIGURATION ---
const WHATSAPP_NUMBER = "0624831624";
const AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

interface OrderLine {
  size: string;
  quantity: number;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // === TOUS LES HOOKS DÉCLARÉS EN PREMIER (TOUJOURS, SANS CONDITION) ===
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", postalCode: "", paymentMethod: "cash"
  });
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [tempSize, setTempSize] = useState<string>("M");
  const [tempQuantity, setTempQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // === RÉCUPÉRATION DU PRODUIT ===
  const product = useMemo((): Product | null => {
    if (!id) return null;
    const found = products.find(p => p.id === id);
    return found || null;
  }, [id]);

  // Calcul du total (doit être avant les conditions de retour)
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return orderLines.reduce((sum, line) => sum + line.quantity * product.price, 0);
  }, [orderLines, product]);

  // === MAINTENANT LES CONDITIONS DE RETOUR (APRÈS TOUS LES HOOKS) ===
  
  // Si produit non trouvé
  // Add debugging log for `id`
  console.log("Product ID:", id);

  // Improve error handling for missing product
  if (!product) {
    console.error("Product not found for ID:", id);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-950/90 text-white flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-black">Produit introuvable</h1>
          <p className="text-xl text-gray-400">Ce produit n'existe pas ou a été retiré.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-teal-500 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Gestion panier
  const handleAddLine = () => {
    if (tempQuantity < 1) return;

    setOrderLines(prev => {
      const existing = prev.find(l => l.size === tempSize);
      if (existing) {
        return prev.map(l =>
          l.size === tempSize ? { ...l, quantity: l.quantity + tempQuantity } : l
        );
      }
      return [...prev, { size: tempSize, quantity: tempQuantity }];
    });

    setTempQuantity(1);
  };

  const handleUpdateQuantity = (size: string, delta: number) => {
    setOrderLines(prev => prev
      .map(l => l.size === size ? { ...l, quantity: l.quantity + delta } : l)
      .filter(l => l.quantity > 0)
    );
  };

  const handleRemoveLine = (size: string) => {
    setOrderLines(prev => prev.filter(l => l.size !== size));
  };

  // Navigation images
  const nextImage = () => setCurrentImageIndex(i => (i + 1) % product.image_urls.length);
  const prevImage = () => setCurrentImageIndex(i => (i - 1 + product.image_urls.length) % product.image_urls.length);

  // Envoi WhatsApp
  const handleSubmit = () => {
    if (orderLines.length === 0) return alert("Veuillez ajouter au moins un article");
    if (!form.firstName || !form.lastName || !form.phone || !form.address || !form.city) {
      return alert("Veuillez remplir tous les champs obligatoires");
    }

    setIsSubmitting(true);

    const items = orderLines
      .map(l => `• ${l.quantity}x ${product.name} (Taille ${l.size})`)
      .join("\n");

    const message = `
*NOUVELLE COMMANDE*

${product.name} - ${product.price} MAD

${items}

*Total : ${totalPrice} MAD*

*Client*
${form.firstName} ${form.lastName}
${form.phone}
${form.email || "—"}

*Adresse de livraison*
${form.address}
${form.city}${form.postalCode ? ` ${form.postalCode}` : ""}

Paiement à la livraison (espèces)
`.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    setSubmitSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      setSubmitSuccess(false);
      setOrderLines([]);
      setForm({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", city: "", postalCode: "", paymentMethod: "cash"
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-950/90 text-white relative overflow-hidden">
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header */}
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Détails du produit
              </h1>
              <p className="text-sm text-gray-400 mt-1">Qualité premium • Livraison rapide</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isLiked ? "bg-red-600 text-white shadow-lg shadow-red-500/50" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
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
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
        >
          <ChevronLeft size={20} /> Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* === COLONNE GAUCHE : IMAGES === */}
          <div className="flex flex-col justify-start space-y-6">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl opacity-20 group-hover:opacity-30 blur-2xl transition-all duration-700 animate-pulse" />

              <div className="relative transform transition-all duration-700 group-hover:scale-[1.02]">
                <div className="relative w-full aspect-square rounded-3xl shadow-2xl overflow-hidden">
                  <img
                    src={product.image_urls[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />

                  {product.is_new && (
                    <div className="absolute top-6 left-6 z-20">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
                        <Zap size={18} className="fill-current" />
                        NOUVEAUTÉ
                      </div>
                    </div>
                  )}

                  {product.image_urls.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition">
                        <ChevronLeft size={28} />
                      </button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition">
                        <ChevronRight size={28} />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {product.image_urls.map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 rounded-full transition-all ${i === currentImageIndex ? "w-8 bg-emerald-400" : "w-2 bg-gray-600"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="absolute top-6 left-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg z-20">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Zoom au survol
                  </div>
                </div>
              </div>
            </div>

            {product.image_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.image_urls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`rounded-2xl overflow-hidden border-4 transition-all ${i === currentImageIndex ? "border-emerald-500 shadow-lg shadow-emerald-500/30" : "border-gray-700"}`}
                  >
                    <img src={url} alt={`Vue ${i + 1}`} className="w-full aspect-square object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, text: "Livraison rapide", color: "from-emerald-500 to-teal-500" },
                { icon: Shield, text: "Paiement sécurisé", color: "from-red-500 to-pink-500" },
                { icon: RotateCcw, text: "Retour facile", color: "from-cyan-500 to-blue-500" }
              ].map((f, i) => (
                <div key={i} className="relative group/card transform hover:-translate-y-1 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} rounded-2xl opacity-10 group-hover/card:opacity-20 transition-opacity`} />
                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-500/20">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-2 mx-auto shadow-lg`}>
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-gray-200 text-center">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* === COLONNE DROITE : FORMULAIRE === */}
          <div className="flex flex-col space-y-6">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-500/20 p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/50">
                  En stock
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-sm text-gray-400 ml-2">(128 avis)</span>
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
            </div>

            {/* === FORMULAIRE DE COMMANDE === */}
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-500/20 p-8">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <Package className="w-7 h-7 text-emerald-400" />
                Finaliser la commande
              </h3>

              <div className="space-y-6">

                {/* Sélection taille + quantité */}
                <div className="border-b-2 border-gray-800 pb-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-400" />
                    Ajouter au panier
                  </h4>
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {AVAILABLE_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTempSize(size)}
                        className={`py-2 px-2 rounded-xl font-bold transition-all duration-300 text-sm ${
                          tempSize === size
                            ? "bg-red-600 text-white shadow-xl shadow-red-500/50"
                            : "bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-red-500 hover:bg-gray-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-2 border-2 border-gray-700 flex-grow">
                      <button type="button" onClick={() => setTempQuantity(Math.max(1, tempQuantity - 1))} className="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-700 hover:border-emerald-500 hover:bg-gray-800 font-bold text-gray-200 transition-all duration-300 flex items-center justify-center">
                        <Minus size={18} />
                      </button>
                      <span className="flex-1 text-center text-xl font-black text-white">{tempQuantity}</span>
                      <button type="button" onClick={() => setTempQuantity(tempQuantity + 1)} className="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-700 hover:border-emerald-500 hover:bg-gray-800 font-bold text-gray-200 transition-all duration-300 flex items-center justify-center">
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="flex-shrink-0 py-3 px-6 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-500/50 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Résumé panier */}
                <div className="border-b-2 border-gray-800 pb-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    Votre panier ({orderLines.reduce((s, l) => s + l.quantity, 0)} articles)
                  </h4>

                  {orderLines.length === 0 ? (
                    <div className="text-center py-4 bg-gray-800/50 rounded-xl text-gray-400 font-semibold">
                      Votre panier est vide. Ajoutez une taille ci-dessus !
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orderLines.map((line) => (
                        <div key={line.size} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-gray-700">
                          <div className="flex-1">
                            <p className="font-bold text-white">{product.name} - Taille: {line.size}</p>
                            <p className="text-xs text-gray-400">{line.quantity} × {product.price} MAD</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateQuantity(line.size, -1)} className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-white w-6 text-center">{line.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(line.size, 1)} className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
                              <Plus size={14} />
                            </button>
                            <button onClick={() => handleRemoveLine(line.size)} className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white ml-2 flex items-center justify-center">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Informations personnelles */}
                <div className="border-t-2 border-gray-800 pt-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-400" />
                    Informations personnelles <span className="text-red-400 text-xs ml-2">(Obligatoire)</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required placeholder=" " className="peer w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label className="absolute left-4 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Prénom</label>
                    </div>
                    <div className="relative">
                      <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required placeholder=" " className="peer w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label className="absolute left-4 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Nom</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 peer-focus:text-emerald-400 z-10" />
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder=" " className="peer w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label className="absolute left-12 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:left-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Email (facultatif)</label>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 peer-focus:text-emerald-400 z-10" />
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder=" " className="peer w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"/>
                      <label className="absolute left-12 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:left-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">Téléphone</label>
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="border-t-2 border-gray-800 pt-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    Adresse de livraison <span className="text-red-400 text-xs ml-2">(Obligatoire)</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500 peer-focus:text-emerald-400 z-10" />
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        required
                        placeholder=" "
                        className="peer w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"
                      />
                      <label className="absolute left-12 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:left-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">
                        Adresse complète (rue, quartier, immeuble...)
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          required
                          placeholder=" "
                          className="peer w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-transparent focus:border-emerald-500 focus:outline-none focus:bg-gray-900 focus:shadow-lg transition-all duration-300"
                        />
                        <label className="absolute left-4 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs transition-all duration-300 text-gray-400 peer-focus:text-emerald-400 font-bold text-sm bg-gray-900 px-2 rounded">
                          Code postal (facultatif)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paiement */}
                <div className="border-t-2 border-gray-800 pt-6">
                  <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-400" />
                    Paiement
                  </h4>
                  <div className="bg-gray-800/50 rounded-xl p-4 border-2 border-emerald-500/30 text-center">
                    <p className="font-bold text-emerald-400">Paiement à la livraison (espèces)</p>
                    <p className="text-sm text-gray-400 mt-1">Vous réglez le livreur en cash à la réception</p>
                  </div>
                </div>

                {/* Total + Bouton WhatsApp */}
                <div className="border-t-2 border-gray-800 pt-6 space-y-4">
                  <div className="flex justify-between items-center bg-gray-800 rounded-xl p-4 border-2 border-gray-700">
                    <p className="text-lg font-bold text-gray-200">Prix total :</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                      {totalPrice} <span className="text-xl">MAD</span>
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || submitSuccess || orderLines.length === 0}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl shadow-2xl font-black text-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group/btn ${
                      submitSuccess
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/50"
                        : isSubmitting
                        ? "bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-red-400/50 cursor-wait"
                        : orderLines.length === 0
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-600/40 hover:shadow-red-500/60"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    {submitSuccess ? (
                      <Check size={20} className="relative z-10" />
                    ) : isSubmitting ? (
                      <span className="relative z-10">Préparation WhatsApp...</span>
                    ) : orderLines.length === 0 ? (
                      <span className="relative z-10">Ajoutez des articles pour commander</span>
                    ) : (
                      <>
                        <Send size={20} className="relative z-10 group-hover/btn:rotate-6 transition" />
                        <span className="relative z-10">Commander via WhatsApp</span>
                      </>
                    )}
                  </button>

                  {submitSuccess && (
                    <p className="text-center text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Chat WhatsApp ouvert ! Confirmez le message
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