import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home, Sparkles } from 'lucide-react';

export function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 relative overflow-hidden">
      {/* Animated RGB Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500 rounded-full filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] animate-pulse delay-150"></div>
      </div>
      
      <div className="relative container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center border-2 border-green-500/30">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
            </div>
            
            <h1 className="mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Thank You for Your Purchase!
            </h1>
            
            <p className="mb-3 text-gray-300 text-xl">
              Your order has been successfully placed
            </p>
            <p className="text-gray-400 text-lg">
              You will receive a confirmation email shortly with your order details.
            </p>
          </div>

          {/* Order Info Card */}
          <div className="mb-10 p-10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl"></div>
            
            <div className="relative space-y-8">
              {/* Success Message */}
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-green-500/10 border border-green-500/30">
                <Sparkles className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2 text-green-400 text-xl">Order Confirmed</h3>
                  <p className="text-gray-300">
                    We're processing your order and will send you tracking information once it ships.
                  </p>
                </div>
              </div>

              {/* What's Next */}
              <div>
                <h3 className="mb-6 text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  What happens next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white">1</span>
                    </div>
                    <div>
                      <p className="text-gray-300">
                        <span className="text-white">Order Confirmation</span> - Check your email for order details
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white">2</span>
                    </div>
                    <div>
                      <p className="text-gray-300">
                        <span className="text-white">Processing</span> - We'll prepare your items for shipment
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white">3</span>
                    </div>
                    <div>
                      <p className="text-gray-300">
                        <span className="text-white">Shipping</span> - Your order will be on its way with tracking info
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white">4</span>
                    </div>
                    <div>
                      <p className="text-gray-300">
                        <span className="text-white">Delivery</span> - Enjoy your new products!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            >
              <Package className="w-5 h-5" />
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30">
            <p className="text-blue-400 text-center">
              💡 Need help? Contact our support team at support@techshop.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
