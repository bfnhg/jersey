import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

export default function ProductCard({ id, name, price, image, category, isNew }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate(`/checkout?product=${id}&quantity=1`);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {isNew && (
        <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          NEW
        </div>
      )}

      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-600 text-red-600' : 'text-gray-600'}`}
        />
      </button>

      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
            {category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {price.toFixed(2)} MAD
          </span>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-semibold">Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}