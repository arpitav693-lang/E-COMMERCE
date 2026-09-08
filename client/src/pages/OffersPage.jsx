import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const coupons = [
  {
    code: 'SWIGGY50',
    discount: 'Flat ₹50 OFF',
    condition: 'On orders above ₹199',
    description: 'Use code SWIGGY50 & get flat ₹50 discount on your favorite restaurants.',
    color: 'from-orange-500 to-amber-500'
  },
  {
    code: 'WELCOME100',
    discount: 'Flat ₹100 OFF',
    condition: 'On orders above ₹299',
    description: 'Special welcome treat! Save ₹100 instantly on your delicious meal.',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    code: 'JUMBO20',
    discount: '20% OFF up to ₹150',
    condition: 'On orders above ₹500',
    description: 'Feasting with friends or family? Unlock generous savings on combo platters.',
    color: 'from-emerald-600 to-teal-600'
  }
];

const OffersPage = () => {
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-3xl p-8 sm:p-12 text-white mb-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center space-x-1.5 bg-black/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mega Food Savings</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Exclusive Deals, Discounts & Promo Coupons
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Apply these handpicked promo codes at checkout to enjoy mouth-watering savings on top restaurants.
          </p>
        </div>
      </div>

      {/* Coupons Grid */}
      <h2 className="text-2xl font-black text-gray-900 mb-6">Available Coupons</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-orange-100 text-swiggy-orange text-xs font-black rounded-lg uppercase tracking-wider">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-gray-500">{c.condition}</span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">{c.discount}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{c.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={() => copyToClipboard(c.code)}
                className="flex items-center space-x-1.5 text-xs font-bold text-swiggy-orange hover:text-swiggy-orangeHover transition-colors uppercase tracking-wider"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <Link
                to="/"
                className="text-xs font-bold text-gray-700 hover:text-swiggy-black flex items-center space-x-1"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;

