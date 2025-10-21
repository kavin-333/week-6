import { ShoppingCart, Home, Package, User, LogOut, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export function Header() {
  const totalItems = useCartStore(state => state.getTotalItems());
  const isAuthenticated = useCartStore(state => state.isAuthenticated);
  const user = useCartStore(state => state.user);
  const logout = useCartStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-xl tracking-wide">
              TechShop
            </span>
          </Link>
          
          <nav className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link 
              to="/products" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Package className="w-5 h-5" />
              Products
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center gap-2 relative group"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">Cart</span>
            </Link>

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <User className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
