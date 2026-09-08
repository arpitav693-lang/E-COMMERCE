import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const {
    _id,
    name,
    cuisines,
    rating,
    deliveryTime,
    priceForTwo,
    image,
    areaName,
    offer,
    isVegOnly
  } = restaurant;

  return (
    <Link
      to={`/restaurant/${_id}`}
      className="group flex flex-col rounded-2xl transition-all duration-200 hover:scale-[0.97] cursor-pointer"
    >
      {/* Image container with offer badge */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xs bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Offer text */}
        {offer && (
          <div className="absolute bottom-3 left-3 text-white font-black text-lg tracking-tight uppercase drop-shadow-md">
            {offer}
          </div>
        )}

        {/* Veg Only Tag */}
        {isVegOnly && (
          <div className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            PURE VEG
          </div>
        )}
      </div>

      {/* Details */}
      <div className="pt-3 px-1">
        <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-swiggy-orange transition-colors">
          {name}
        </h3>

        <div className="flex items-center space-x-2 text-sm font-bold text-gray-800 mt-1">
          {/* Green rating pill */}
          <div className="flex items-center space-x-1 bg-green-700 text-white px-1.5 py-0.5 rounded-full text-xs">
            <Star className="w-3 h-3 fill-current" />
            <span>{rating}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1 text-gray-700">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>{deliveryTime}</span>
          </div>
          <span>•</span>
          <span className="text-gray-700">₹{priceForTwo} for two</span>
        </div>

        {/* Cuisines */}
        <p className="text-xs text-gray-500 truncate mt-1">
          {Array.isArray(cuisines) ? cuisines.join(', ') : cuisines}
        </p>

        {/* Location */}
        <p className="text-xs text-gray-400 truncate">
          {areaName}
        </p>
      </div>
    </Link>
  );
};

export default RestaurantCard;

