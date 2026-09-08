import React from 'react';
import { Star, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodItemCard = ({ item, restaurant }) => {
  const { getItemQuantity, addItem, removeItem } = useCart();
  const quantity = getItemQuantity(item._id);

  return (
    <div className="py-6 flex justify-between items-start gap-4 border-b border-gray-200 last:border-b-0">
      
      {/* Left Details */}
      <div className="flex-1 pr-2">
        {/* Veg / Non-Veg Icon */}
        <div className="flex items-center space-x-2 mb-1">
          <span
            className={`inline-flex items-center justify-center w-4 h-4 rounded-xs border ${
              item.isVeg ? 'border-green-600' : 'border-red-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-green-600' : 'bg-red-600'
              }`}
            />
          </span>

          {item.isBestseller && (
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              ★ Bestseller
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-bold text-gray-800 text-base sm:text-lg">
          {item.name}
        </h4>

        {/* Price */}
        <div className="text-gray-900 font-semibold text-sm mt-0.5">
          ₹{item.price}
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="flex items-center space-x-1 mt-1 text-xs font-semibold text-green-700">
            <Star className="w-3 h-3 fill-current" />
            <span>{item.rating}</span>
            <span className="text-gray-400 font-normal">({item.ratingCount || 10})</span>
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed max-w-lg">
            {item.description}
          </p>
        )}
      </div>

      {/* Right Image + Add Button */}
      <div className="relative flex flex-col items-center shrink-0 w-28 sm:w-36">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-28 h-24 sm:w-36 sm:h-28 object-cover rounded-xl shadow-xs"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="w-28 h-24 sm:w-36 sm:h-28 bg-orange-50 rounded-xl flex items-center justify-center text-swiggy-orange text-xs font-bold">
            Freshly Made
          </div>
        )}

        {/* Quantity Stepper / ADD Button */}
        <div className="absolute -bottom-3 shadow-md bg-white rounded-lg border border-gray-200 overflow-hidden text-sm font-bold">
          {quantity > 0 ? (
            <div className="flex items-center text-swiggy-green">
              <button
                onClick={() => removeItem(item._id)}
                className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="px-2 text-swiggy-black select-none text-xs sm:text-sm">
                {quantity}
              </span>
              <button
                onClick={() => addItem(item, restaurant)}
                className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(item, restaurant)}
              className="px-6 py-1.5 text-swiggy-green font-black uppercase text-xs tracking-wider hover:bg-green-50 transition-colors"
            >
              ADD
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default FoodItemCard;

