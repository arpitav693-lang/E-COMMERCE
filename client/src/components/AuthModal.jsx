import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, phone, role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoRole) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center space-x-2 text-swiggy-orange mb-2">
            <div className="w-7 h-7 rounded-lg bg-swiggy-orange text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="font-extrabold tracking-wider text-sm uppercase">SWIGGY ACCOUNT</span>
          </div>

          <h3 className="text-2xl font-black text-gray-900">
            {authModalMode === 'login' ? 'Login to continue' : 'Sign up for Swiggy'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {authModalMode === 'login' 
              ? 'or ' : 'or '}
            <button
              onClick={() => {
                setError('');
                setAuthModalMode(authModalMode === 'login' ? 'register' : 'login');
              }}
              className="text-swiggy-orange font-bold hover:underline"
            >
              {authModalMode === 'login' ? 'create an account' : 'login to your account'}
            </button>
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mx-8 mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-swiggy-orange text-sm font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@swiggy.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-swiggy-orange text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-swiggy-orange text-sm font-medium"
            />
          </div>

          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-swiggy-orange text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  Account Type
                </label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                      role === 'customer'
                        ? 'border-swiggy-orange bg-orange-50 text-swiggy-orange'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                      role === 'admin'
                        ? 'border-swiggy-orange bg-orange-50 text-swiggy-orange'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Restaurant Admin
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-swiggy-orange text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-swiggy-orangeHover transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : authModalMode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="p-8 pt-6 border-t border-gray-100 mt-6 bg-gray-50/70">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Demo Login</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('user@swiggy.com', 'customer')}
              className="py-2 px-3 bg-white border border-gray-200 hover:border-swiggy-orange rounded-xl text-xs font-bold text-gray-700 hover:text-swiggy-orange transition-colors text-center shadow-2xs"
            >
              👤 Demo Customer
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin@swiggy.com', 'admin')}
              className="py-2 px-3 bg-white border border-gray-200 hover:border-indigo-600 rounded-xl text-xs font-bold text-gray-700 hover:text-indigo-600 transition-colors text-center shadow-2xs"
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;

