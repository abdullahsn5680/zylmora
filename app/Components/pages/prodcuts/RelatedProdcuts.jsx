'use client'
import React, { useRef, useState, useEffect } from 'react'
import Card from '../../UI/Card/Card';
import { safeFetch } from '@/Utils/safeFetch';
import { ChevronLeft, ChevronRight } from 'lucide-react'

function RelatedProducts({ prop }) {
  const { pid, category, subcategory } = prop
  const scrollRef = useRef(null);
  const [relatedProducts, setRP] = useState([]);

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

  return (
    <div className="related_products max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
      
     
      <div className="mb-4 sm:mb-8 flex items-center justify-between bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-slate-100">
        <div>
          <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-slate-800 mb-1 sm:mb-2 flex gap-2 items-center transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              className="sm:w-8 sm:h-8 lg:w-12 lg:h-12" 
              viewBox="0 0 48 48" 
              fill="#FF6B6B"
            >
              <path d="M16 4L8 12v28a4 4 0 004 4h24a4 4 0 004-4V12l-8-8H16zm8 34a6 6 0 100-12 6 6 0 000 12zM12 14h24v4H12v-4z"/>
            </svg>
            Related Products
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600">
            Discover similar products you might like
          </p>
        </div>
      </div>

     
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-lg">
        
       
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-white via-white/90 via-white/60 to-transparent z-1"></div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-white via-white/90 via-white/60 to-transparent z-1"></div>

       
        <div className="hidden sm:flex justify-between items-center absolute top-1/2 left-0 right-0 px-2 sm:px-4 z-2 -translate-y-1/2">
          <button
            onClick={() => scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' })}
            className="bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-slate-800 hover:text-white hover:scale-105 shadow-md hover:shadow-lg p-2 sm:p-3 rounded-full transition-all duration-300 border border-slate-200"
          >
            <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' })}
            className="bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-slate-800 hover:text-white hover:scale-105 shadow-md hover:shadow-lg p-2 sm:p-3 rounded-full transition-all duration-300 border border-slate-200"
          >
            <ChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

       
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto gap-2 sm:gap-4 lg:gap-6 px-3 sm:px-6 lg:px-24 no-scrollbar scroll-smooth"
        >
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <div 
                className="py-3 sm:py-4 lg:py-6 flex-shrink-0 transition-transform hover:scale-105" 
                key={item._id}
              >
                <Card prop={item} isRelated={true} />
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full w-full py-8 sm:py-12 min-w-full">
              <div className="text-center space-y-2 sm:space-y-4">
                <div className="text-2xl sm:text-4xl">🛍️</div>
                <h4 className="text-lg sm:text-xl font-semibold text-slate-800">No Related Products</h4>
                <p className="text-slate-500 text-xs sm:text-sm">Check back later for similar items</p>
              </div>
            </div>
          )}
        </div>

     
        {relatedProducts.length > 0 && (
          <div className="flex sm:hidden justify-center pb-3">
            <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
              Swipe to see more →
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RelatedProducts