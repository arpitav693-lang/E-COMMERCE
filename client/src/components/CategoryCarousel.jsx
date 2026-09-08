import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryCarousel = ({ categories, selectedCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          What's on your mind?
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shadow-xs"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shadow-xs"
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <div
              key={cat.id || cat.name}
              onClick={() => onSelectCategory(isSelected ? '' : cat.name)}
              className="flex-shrink-0 cursor-pointer flex flex-col items-center group text-center select-none"
            >
              <div 
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-swiggy-orange scale-105' : 'group-hover:scale-105'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback generic food image if external cdn blocks
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <span className={`mt-2 text-sm font-semibold transition-colors ${
                isSelected ? 'text-swiggy-orange font-bold' : 'text-gray-800 group-hover:text-swiggy-orange'
              }`}>
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
      <hr className="mt-6 border-gray-200" />
    </section>
  );
};

export default CategoryCarousel;

