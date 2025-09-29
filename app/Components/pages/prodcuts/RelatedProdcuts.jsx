'use client'
import React, { useRef, useState, useEffect } from 'react'
import Card from '../../UI/Card/Card';
import { safeFetch } from '@/Utils/safeFetch';
import { ChevronLeft, ChevronRight, Sparkles, Heart, TrendingUp } from 'lucide-react'

function RelatedProducts({ prop }) {
  const { pid, category, subcategory } = prop
  const scrollRef = useRef(null);
  const [relatedProducts, setRP] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (!pid || !category || !subcategory) return;

    const getRp = async () => {
      const Query = new URLSearchParams({
        category: category,
        subcategory: subcategory,
      });
      const res = await safeFetch(`/api/RelatedProducts/?${Query.toString()}`);
      const data = res
      if (data.success) {
        const related = data.products.filter(p => p.pid !== pid);
        setRP(related);
      }
    };

    getRp();
  }, [pid, category, subcategory]);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      checkScrollButtons();
      scrollElement.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        scrollElement.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [relatedProducts]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="related_products max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      
     
      <div className="mb-8 lg:mb-12 relative">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/60 relative overflow-hidden">
         
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full filter blur-2xl opacity-30" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
            
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Heart className="text-white" size={28} />
                </div>
              </div>
              
            
              <div>
                <h3 className="text-[1.3rem] sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 mb-2 flex items-center gap-3">
                  You May Also Like
                </h3>
                <p className="text-sm hidden md:flex sm:text-base text-gray-600 font-medium">
                  Discover similar products handpicked just for you
                </p>
              </div>
            </div>
            
           
            <div className="hidden lg:flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/60">
              <Sparkles className="text-blue-600" size={20} />
              <span className="text-sm font-bold text-gray-700">
                {relatedProducts.length} Items
              </span>
            </div>
          </div>
          
        
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-3xl" />
        </div>
      </div>

      
      <div className="relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/60 overflow-hidden">
        
      
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-24 lg:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

       
        {relatedProducts.length > 0 && (
          <div className="hidden sm:flex justify-between items-center absolute top-1/2 left-0 right-0 px-4 lg:px-6 z-20 -translate-y-1/2 pointer-events-none">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`pointer-events-auto group relative bg-white/95 backdrop-blur-sm text-gray-700 shadow-xl p-3 lg:p-4 rounded-2xl transition-all duration-300 border-2 border-gray-200/60 ${
                canScrollLeft 
                  ? 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:scale-110 hover:border-transparent' 
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={24} className="transition-transform duration-300 group-hover:-translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`pointer-events-auto group relative bg-white/95 backdrop-blur-sm text-gray-700 shadow-xl p-3 lg:p-4 rounded-2xl transition-all duration-300 border-2 border-gray-200/60 ${
                canScrollRight 
                  ? 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:scale-110 hover:border-transparent' 
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={24} className="transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />
            </button>
          </div>
        )}

      
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto gap-4 sm:gap-6 lg:gap-8 px-6 sm:px-12 lg:px-16 py-8 sm:py-10 lg:py-12 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item, index) => (
              <div 
                className="flex-shrink-0 transition-all duration-300 hover:scale-105 animate-fade-in-up" 
                key={item._id}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <Card prop={item} isRelated={true} />
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full w-full py-16 sm:py-20 min-w-full">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center shadow-xl">
                  <TrendingUp className="text-gray-500" size={40} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-800 mb-3">No Related Products</h4>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Check back later for similar items we think you'll love
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      
        {relatedProducts.length > 0 && (
          <div className="flex sm:hidden justify-center pb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200/60">
              <span className="text-xs font-bold text-gray-700">Swipe to explore</span>
              <ChevronRight size={14} className="text-gray-600 animate-pulse" />
            </div>
          </div>
        )}
      </div>

  
    </div>
  )
}

export default RelatedProducts