'use client'
import React, { useEffect, useState, useContext } from 'react';
import { safeFetch } from '@/Utils/safeFetch';
import Loader from '@/app/Components/Loader/loader';
import { useRouter } from 'next/navigation';
function page() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router =useRouter();
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await safeFetch('/api/catagories', {}, 36);
      if (response.success) {
        setCategoriesData(response.categories || []);
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
   <Loader/>
    );
  }
  const performAction = (cat,subCat) => {
    const query = new URLSearchParams({
      category: cat,
      subcategory: subCat,
    }).toString();
    router.push(`/Collections?${query}`);
  };
  if (error) {
    return (
      <div className="min-h-screen mb-32 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 mx-4 max-w-lg border border-gray-100">
          <div className="text-8xl mb-6">😔</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Something went wrong</h2>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">{error}</p>
          <button
            onClick={fetchCategories}
            className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      
         <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-white/80 hover:bg-slate-100 rounded-xl sm:rounded-xl md:rounded-2xl text-slate-700 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm sm:text-base font-medium">Back</span>
        </button>
 
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-lg sm:text-xl md:text-2xl">🛍️</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
            
Shop Categories
          </h1>
        </div>
      </div>
    </div>
  </div>
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <div className="text-center">
      
  
            <p className="text-slate-600 text-sm sm:text-base md:text-xl lg:text-2xl font-light max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2">
              Discover our carefully curated collection of premium products across all categories
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
        {categoriesData.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-7 md:mb-8 shadow-inner">
              <span className="text-4xl sm:text-5xl md:text-6xl opacity-60">🏪</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-700 mb-3 sm:mb-4">No Categories Available</h2>
            <p className="text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed max-w-sm sm:max-w-md mx-auto px-4">
              Categories will appear here once our products are organized and ready for you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {categoriesData.map((category, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100"
              > 
              
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                  <img
                    src={category.image || '/placeholder-category.jpg'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
                              <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
                            </linearGradient>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grad1)"/>
                          <rect x="50" y="50" width="300" height="200" rx="20" fill="#ffffff" opacity="0.8"/>
                          <text x="50%" y="50%" font-family="system-ui" font-size="28" font-weight="600" fill="#475569" text-anchor="middle" dy=".3em">
                            ${category.name}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  
              
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 shadow-lg">
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-slate-700">Available</span>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                  <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-slate-800 mb-1 sm:mb-2 md:mb-3 group-hover:text-slate-600 transition-colors duration-300 leading-tight">
                    {category.name}
                  </h3>
                  
                  <p className="text-[9px] md:text-xs text-slate-500 mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-relaxed  sm:block">
                    Explore our premium collection
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className=""></div>
                    <div onClick={()=>{performAction(category.cat,category.subCat)}} className="bg-slate-100 group-hover:bg-slate-800 text-slate-600 group-hover:text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform group-hover:scale-105 ml-auto sm:ml-0">
                      View
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl sm:rounded-t-3xl"></div>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
}

export default page;