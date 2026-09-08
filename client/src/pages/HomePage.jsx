import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Zap, 
  Percent, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import CategoryCarousel from '../components/CategoryCarousel';
import RestaurantCard from '../components/RestaurantCard';
import { restaurantAPI } from '../services/api';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterRating4Plus, setFilterRating4Plus] = useState(false);
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterFastDelivery, setFilterFastDelivery] = useState(false);
  const [filterOffers, setFilterOffers] = useState(false);
  const [sortBy, setSortBy] = useState(''); // 'rating', 'deliveryTime', 'priceAsc', 'priceDesc'

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [filterRating4Plus, filterVegOnly, sortBy, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await restaurantAPI.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterVegOnly) params.isVegOnly = true;
      if (filterRating4Plus) params.rating = 4.0;
      if (sortBy) params.sortBy = sortBy;
      if (selectedCategory) params.search = selectedCategory;

      const res = await restaurantAPI.getAll(params);
      setRestaurants(res.data);
    } catch (err) {
      console.error('Failed to fetch restaurants', err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side quick filter for search bar
  const displayedRestaurants = restaurants.filter((r) => {
    if (filterFastDelivery && r.deliveryTimeMin > 25) return false;
    if (filterOffers && !r.offer) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisines?.some(c => c.toLowerCase().includes(q));
      const matchArea = r.areaName?.toLowerCase().includes(q);
      return matchName || matchCuisine || matchArea;
    }
    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setFilterRating4Plus(false);
    setFilterVegOnly(false);
    setFilterFastDelivery(false);
    setFilterOffers(false);
    setSortBy('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Search Header Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for restaurant, cuisine, or a dish (e.g. Biryani, Burger, Pizza)..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-xs text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-swiggy-orange focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-xs font-bold text-gray-400 hover:text-gray-700"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Category Carousel ("What's on your mind?") */}
      {categories.length > 0 && (
        <CategoryCarousel
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      )}

      {/* Filter and Sort Pills */}
      <div className="my-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Restaurants with online food delivery in Delhi</span>
            <span className="text-xs bg-orange-100 text-swiggy-orange font-bold px-2 py-0.5 rounded-full">
              {displayedRestaurants.length}
            </span>
          </h2>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar text-xs font-bold">
          {/* Fast Delivery */}
          <button
            onClick={() => setFilterFastDelivery(!filterFastDelivery)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all ${
              filterFastDelivery
                ? 'bg-swiggy-black text-white border-swiggy-black shadow-xs'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Fast Delivery</span>
          </button>

          {/* Rating 4.0+ */}
          <button
            onClick={() => setFilterRating4Plus(!filterRating4Plus)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all ${
              filterRating4Plus
                ? 'bg-swiggy-black text-white border-swiggy-black shadow-xs'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>Ratings 4.0+</span>
          </button>

          {/* Pure Veg */}
          <button
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all ${
              filterVegOnly
                ? 'bg-green-700 text-white border-green-700 shadow-xs'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Pure Veg</span>
          </button>

          {/* Offers */}
          <button
            onClick={() => setFilterOffers(!filterOffers)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all ${
              filterOffers
                ? 'bg-swiggy-black text-white border-swiggy-black shadow-xs'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Offers</span>
          </button>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-white border border-gray-300 rounded-full text-gray-700 font-bold hover:bg-gray-50 focus:outline-hidden focus:ring-1 focus:ring-swiggy-orange cursor-pointer"
          >
            <option value="">Sort By: Relevance</option>
            <option value="rating">Rating: High to Low</option>
            <option value="deliveryTime">Delivery Time</option>
            <option value="priceAsc">Cost: Low to High</option>
            <option value="priceDesc">Cost: High to Low</option>
          </select>

          {/* Clear Filters */}
          {(filterRating4Plus || filterVegOnly || filterFastDelivery || filterOffers || sortBy || selectedCategory || searchQuery) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-red-600 px-3 py-2 hover:bg-red-50 rounded-full transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Restaurant Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="animate-pulse flex flex-col space-y-3">
              <div className="bg-gray-200 aspect-[4/3] rounded-2xl w-full" />
              <div className="h-5 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-200 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : displayedRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {displayedRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-xs">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No restaurants match your filters</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-4">
            Try resetting your search query or loosening the filters to find more great food.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-swiggy-orange text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-swiggy-orangeHover transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default HomePage;

