// // src/components/CardJersey.tsx
// "use client";

// import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
// import { Product } from "../data/products";
// import { ShoppingBag, Eye, Sparkles, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function CardJersey({ product }: { product: Product }) {
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const [showToast, setShowToast] = useState(false);

//   const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation(); // Obligatoire ici !
//     addToCart(product, "M", 1);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2000);
//   };

//   const handleView = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation(); // Obligatoire aussi !
//     navigate(`/product/${product.id}`);
//   };

//   return (
//     <>
//       <CardContainer containerClassName="py-8">
//         <CardBody className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/30 hover:border-emerald-500/40 transition-all duration-500 w-full max-w-[300px] h-[480px] relative overflow-hidden">
          
//           {/* Badge NEW */}
//           {product.is_new && (
//             <div className="absolute top-4 right-4 z-50">
//               <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
//                 <Sparkles size={13} />
//                 NEW
//               </div>
//             </div>
//           )}

//           {/* Image */}
//           <CardItem
//             translateZ={60}
//             className="w-full h-[260px] overflow-hidden rounded-t-3xl"
//           >
//             <img
//               src={product.image_url}
//               alt={product.name}
//               className="w-full h-full object-cover object-top"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
//           </CardItem>

//           {/* Infos */}
//           <div className="p-5 text-center z-10">
//             <CardItem translateZ={30}>
//               <h3 className="text-white text-lg font-bold line-clamp-2">
//                 {product.name}
//               </h3>
//             </CardItem>

//             <CardItem translateZ={20}>
//               <p className="text-emerald-400 text-xs font-medium mt-2 uppercase tracking-wider">
//                 {product.category}
//               </p>
//             </CardItem>

//             <CardItem translateZ={40} className="mt-4">
//               <p className="text-emerald-400 text-3xl font-black">
//                 {product.price} <span className="text-lg">MAD</span>
//               </p>
//               <div className="h-1 w-20 mx-auto mt-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm" />
//             </CardItem>
//           </div>

//           {/* LES DEUX BOUTONS SEULEMENT CLIQUABLES */}
//           <div className="absolute bottom-4 left-4 right-4 flex gap-3 z-50">
//             {/* BOUTON ADD */}
//             <button
//               onClick={handleAddToCart}
//               className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-red-500/60 transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-white/20 -translate-x-full hover:translate-x-full transition-transform duration-700" />
//               <ShoppingBag size={18} />
//               <span>Add</span>
//             </button>

//             {/* BOUTON VIEW */}
//             <button
//               onClick={handleView}
//               className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-emerald-500/60 transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-white/20 -translate-x-full hover:translate-x-full transition-transform duration-700" />
//               <Eye size={18} />
//               <span>View</span>
//             </button>
//           </div>
//         </CardBody>
//       </CardContainer>

//       {/* TOAST */}
//     <AnimatePresence>
//   {showToast && (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 20 }}
//       // Positionné en haut à droite de l'écran
//       className="fixed top-24 right-6 z-[100] bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg shadow-emerald-900/20 flex items-center gap-3 text-sm font-semibold"
//     >
//       <Check size={18} />
//       <div>
//          <span className="block">{product.name}</span>
//          <span className="text-[10px] opacity-80 font-normal">Ajouté au panier</span>
//       </div>
//     </motion.div>
//   )}
// </AnimatePresence>
//     </>
//   );
// }