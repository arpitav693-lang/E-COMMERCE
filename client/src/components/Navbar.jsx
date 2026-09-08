import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Percent, 
  HelpCircle, 
  User, 
  MapPin, 
  ChevronDown, 
  LogOut, 
  Package, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, openLogin } = useAuth();
  const { totalCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Logo & Location */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-11 h-11 rounded-2xl bg-swiggy-orange flex items-center justify-center text-white font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-swiggy-orange leading-none">
                SWIGGY
              </span>
              <span className="text-[10px] font-bold tracking-widest text-swiggy-gray uppercase">
                Food & Dine
              </span>
            </div>
          </Link>

          {/* Location selector */}
          <div className="hidden md:flex items-center space-x-2 text-sm cursor-pointer hover:text-swiggy-orange group border-l pl-6 border-gray-200">
            <MapPin className="w-4 h-4 text-swiggy-orange shrink-0" />
            <span className="font-bold border-b-2 border-swiggy-black group-hover:border-swiggy-orange pb-0.5 text-swiggy-black group-hover:text-swiggy-orange transition-colors">
              Connaught Place
            </span>
            <span className="text-swiggy-gray text-xs truncate max-w-[150px]">
              New Delhi, Delhi, India
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-swiggy-orange" />
          </div>
        </div>

        {/* Right: Desktop Navigation items */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-gray-700">
          <Link 
            to="/?focusSearch=true" 
            className="flex items-center space-x-2 hover:text-swiggy-orange transition-colors py-2"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <span>Search</span>
          </Link>

          <Link 
            to="/offers" 
            className="flex items-center space-x-2 hover:text-swiggy-orange transition-colors py-2 relative"
          >
            <Percent className="w-4 h-4 text-gray-500" />
            <span>Offers</span>
            <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
              New
            </span>
          </Link>

          <Link 
            to="/admin" 
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors py-2 bg-indigo-50 px-3 rounded-lg"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Partner / Admin</span>
          </Link>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-swiggy-black hover:text-swiggy-orange transition-colors py-2"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 text-swiggy-orange flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-100 text-swiggy-orange">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/my-orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-swiggy-orange"
                  >
                    <Package className="w-4 h-4" />
                    <span>My Orders</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLogin}
              className="flex items-center space-x-2 text-swiggy-black hover:text-swiggy-orange transition-colors font-semibold"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="flex items-center space-x-2 group hover:text-swiggy-orange transition-colors py-2"
          >
            <div className="relative">
              <ShoppingBag className={`w-5 h-5 ${totalCount > 0 ? 'text-swiggy-green' : 'text-gray-600 group-hover:text-swiggy-orange'}`} />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-swiggy-green text-white text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </div>
            <span className={`font-bold ${totalCount > 0 ? 'text-swiggy-green' : ''}`}>
              Cart
            </span>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 lg:hidden">
          <Link to="/cart" className="relative p-2 text-gray-700">
            <ShoppingBag className="w-6 h-6" />
            {totalCount > 0 && (
              <span className="absolute top-0 right-0 bg-swiggy-green text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-6 space-y-3">
          <Link 
            to="/?focusSearch=true" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 py-2 text-gray-700 font-medium"
          >
            <Search className="w-5 h-5 text-gray-400" />
            <span>Search Dishes & Restaurants</span>
          </Link>

          <Link 
            to="/offers" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 py-2 text-gray-700 font-medium"
          >
            <Percent className="w-5 h-5 text-gray-400" />
            <span>Offers & Discounts</span>
          </Link>

          <Link 
            to="/admin" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 py-2 text-indigo-600 font-medium"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Admin / Restaurant Dashboard</span>
          </Link>

          {user ? (
            <>
              <Link 
                to="/my-orders" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 py-2 text-gray-700 font-medium"
              >
                <Package className="w-5 h-5 text-gray-400" />
                <span>My Orders</span>
              </Link>

              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 py-2 text-red-600 font-medium w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out ({user.name})</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                openLogin();
              }}
              className="w-full mt-2 bg-swiggy-orange text-white py-2.5 rounded-lg font-bold shadow-sm"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

