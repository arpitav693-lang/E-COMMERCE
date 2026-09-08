import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  ArrowRight,
  Info,
  Tag
} from 'lucide-react';
import FoodItemCard from '../components/FoodItemCard';
import { restaurantAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { totalCount, itemTotal, cartItems } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dishSearch, setDishSearch] = useState('');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    setLoading(true);
    try {
      const res = await restaurantAPI.getById(id);
      setData(res.data);
      // Open all categories by default
      if (res.data.categories) {
        const initialOpen = {};
        Object.keys(res.data.categories).forEach(cat => {
          initialOpen[cat] = true;
        });
        setOpenCategories(initialOpen);
      }
    } catch (err) {
      console.error('Failed to load restaurant details', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (catName) => {
    setOpenCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-44 bg-gray-200 rounded-2xl w-full mb-8" />
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded-lg w-full" />
          <div className="h-28 bg-gray-200 rounded-xl w-full" />
          <div className="h-28 bg-gray-200 rounded-xl w-full" />
        </div>
      </div>
    );
  }

  if (!data || !data.restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Restaurant Not Found</h2>
        <p className="text-gray-500 mb-6">The restaurant you are looking for might have closed or moved.</p>
        <Link to="/" className="px-5 py-2.5 bg-swiggy-orange text-white rounded-xl font-bold">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const { restaurant, categories } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center space-x-1.5 font-medium">
        <Link to="/" className="hover:text-swiggy-orange">Home</Link>
        <span>/</span>
        <span className="text-gray-500">Delhi</span>
        <span>/</span>
        <span className="text-gray-500">{restaurant.areaName}</span>
        <span>/</span>
        <span className="text-gray-800 font-bold">{restaurant.name}</span>
      </nav>

      {/* Restaurant Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              {restaurant.cuisines?.join(', ')}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {restaurant.address} • {restaurant.areaName}
            </p>
          </div>

          {/* Rating Pill in restaurant header */}
          <div className="border border-gray-200 rounded-2xl p-2.5 flex flex-col items-center justify-center min-w-[75px] shadow-2xs">
            <div className="flex items-center space-x-1 text-green-700 font-black text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>{restaurant.rating}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold border-t border-gray-200 pt-1 mt-1">
              {restaurant.ratingCount || '1K+ ratings'}
            </span>
          </div>
        </div>

        <hr className="my-4 border-dashed border-gray-200" />

        {/* Delivery Time & Cost Info */}
        <div className="flex items-center space-x-6 text-xs sm:text-sm font-bold text-gray-800">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-base font-normal text-gray-500">₹</span>
            <span>₹{restaurant.priceForTwo} for two</span>
          </div>
        </div>

        {/* Offers Pill banner */}
        {restaurant.offer && (
          <div className="mt-4 flex items-center space-x-2 bg-orange-50 border border-orange-200/80 rounded-xl px-4 py-2.5 text-swiggy-orange text-xs font-bold">
            <Tag className="w-4 h-4 shrink-0" />
            <span>{restaurant.offer} | Use code SWIGGY50</span>
          </div>
        )}
      </div>

      {/* Menu Controls: Search in menu & Veg Only Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-gray-100/70 p-3 rounded-2xl">
        
        {/* Search dish */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={dishSearch}
            onChange={(e) => setDishSearch(e.target.value)}
            placeholder="Search for dishes..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs font-semibold border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-swiggy-orange"
          />
        </div>

        {/* Veg Only Toggle */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-700">Veg Only</span>
          <button
            onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
              vegOnlyFilter ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                vegOnlyFilter ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

      </div>

      {/* Categories Accordion */}
      <div className="space-y-6">
        {Object.entries(categories || {}).map(([catName, items]) => {
          // Filter items based on vegOnly & dishSearch
          const filteredItems = items.filter((item) => {
            if (vegOnlyFilter && !item.isVeg) return false;
            if (dishSearch.trim() && !item.name.toLowerCase().includes(dishSearch.toLowerCase())) {
              return false;
            }
            return true;
          });

          if (filteredItems.length === 0) return null;

          const isOpen = openCategories[catName] !== false;

          return (
            <div key={catName} className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
              
              {/* Category Header Bar */}
              <button
                onClick={() => toggleCategory(catName)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-swiggy-orange transition-colors">
                  {catName} ({filteredItems.length})
                </h3>
                <div className="p-1 rounded-full text-gray-500 group-hover:bg-gray-100">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Items in this category */}
              {isOpen && (
                <div className="mt-2 divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <FoodItemCard
                      key={item._id}
                      item={item}
                      restaurant={restaurant}
                    />
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar if items in cart */}
      {totalCount > 0 && (
        <div className="fixed bottom-6 inset-x-0 max-w-2xl mx-auto px-4 z-40 animate-in slide-in-from-bottom-5">
          <div className="bg-swiggy-green text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider opacity-90">
                  {totalCount} {totalCount === 1 ? 'Item' : 'Items'} added
                </p>
                <p className="text-base font-black">₹{itemTotal}</p>
              </div>
            </div>

            <Link
              to="/cart"
              className="flex items-center space-x-2 bg-white text-swiggy-green px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-md"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default RestaurantDetailPage;

