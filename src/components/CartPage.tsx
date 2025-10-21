import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        {/* RGB Background */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-[128px] animate-pulse"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
              <ShoppingBag className="w-16 h-16 text-purple-400" />
            </div>
            <h2 className="mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-4xl">
              Your Cart is Empty
            </h2>
            <p className="mb-10 text-gray-400 text-xl">
              Start adding some awesome products to your cart!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-lg"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* RGB Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-pink-500 rounded-full filter blur-[128px] animate-pulse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] animate-pulse delay-150"></div>
      </div>
      
      <div className="relative container mx-auto px-6">
        <div className="mb-12">
          <h1 className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-5xl md:text-6xl">
            Shopping Cart
          </h1>
          <p className="text-gray-400 text-xl">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div
                key={item.id}
                className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-3">
                      <div>
                        <h3 className="text-white text-xl mb-2">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 h-fit"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-gray-400 text-sm mb-1">
                          ${item.price.toFixed(2)} each
                        </div>
                        <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-2xl">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 backdrop-blur-sm">
              <h2 className="mb-6 text-2xl">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-8 text-2xl">
                <span>Total</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ${(totalPrice * 1.1).toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-3 text-lg mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => navigate('/products')}
                className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
