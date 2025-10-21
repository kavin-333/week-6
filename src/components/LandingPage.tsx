import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Truck } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated RGB Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-[128px] animate-pulse delay-75"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] animate-pulse delay-150"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 border border-purple-500/30">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Welcome to the Future of Shopping
            </span>
          </div>
          
          <h1 className="mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-6xl md:text-7xl lg:text-8xl tracking-tight">
            Next-Gen Tech
            <br />
            Premium Gear
          </h1>
          
          <p className="mb-12 text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto">
            Discover cutting-edge electronics and gaming accessories with unbeatable prices. 
            Elevate your setup with RGB-powered excellence.
          </p>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <button
              onClick={() => navigate('/products')}
              className="group px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-3 text-lg"
            >
              Shop Now
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 text-lg"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-4 text-2xl">Lightning Fast Delivery</h3>
            <p className="text-gray-400 text-lg">Get your products delivered within 24-48 hours with our express shipping.</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-4 text-2xl">Secure Checkout</h3>
            <p className="text-gray-400 text-lg">Shop with confidence using our encrypted payment gateway.</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-4 text-2xl">Free Shipping</h3>
            <p className="text-gray-400 text-lg">Enjoy free shipping on orders over $50. No hidden fees.</p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 border border-white/10 p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 blur-xl"></div>
          <div className="relative">
            <h2 className="mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-4xl md:text-5xl">
              Ready to Upgrade Your Setup?
            </h2>
            <p className="mb-10 text-gray-300 text-xl max-w-2xl mx-auto">
              Browse our collection of 28+ premium products and transform your workspace today.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-12 py-6 bg-white text-black rounded-xl hover:shadow-lg hover:shadow-white/50 transition-all duration-300 text-lg"
            >
              Explore Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
