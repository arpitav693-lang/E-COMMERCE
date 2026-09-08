import React from 'react';
import { useCart } from '../context/CartContext';

const RestaurantConflictModal = () => {
  const {
    conflictModalOpen,
    resolveConflict,
    restaurant,
    pendingItem
  } = useCart();

  if (!conflictModalOpen || !pendingItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-xl font-extrabold text-gray-900 mb-2">
          Items already in cart
        </h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Your cart contains items from <span className="font-bold text-gray-900">{restaurant?.name}</span>. 
          Would you like to reset your cart for adding items from <span className="font-bold text-swiggy-orange">{pendingItem?.restInfo?.name}</span>?
        </p>

        <div className="flex space-x-3">
          <button
            onClick={() => resolveConflict(false)}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors uppercase text-xs tracking-wider"
          >
            No
          </button>
          <button
            onClick={() => resolveConflict(true)}
            className="flex-1 py-3 px-4 bg-swiggy-orange text-white rounded-xl font-bold hover:bg-swiggy-orangeHover transition-colors uppercase text-xs tracking-wider shadow-md"
          >
            Yes, Start Afresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantConflictModal;

