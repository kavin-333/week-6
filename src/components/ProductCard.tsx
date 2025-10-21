import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore, Product } from '../store/cartStore';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  
  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  return (
    <div className="group relative rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden backdrop-blur-sm">
      {/* RGB Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
      
      <div className="relative p-6">
        {/* Product Image */}
        <div className="relative w-full h-56 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        {/* Category Badge */}
        <div className="mb-3 inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-sm">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {product.category}
          </span>
        </div>
        
        {/* Product Name */}
        <h3 className="mb-3 text-white text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="mb-6 text-gray-400 line-clamp-2 text-base">
          {product.description}
        </p>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-2xl">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
