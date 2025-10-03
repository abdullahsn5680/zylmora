'use client'   
import React, { useEffect, useState } from 'react';
import { safeFetch } from '@/Utils/safeFetch';
import Loader from '@/app/Components/Loader/loader';
import { useRouter } from 'next/navigation';
import Heading from '@/app/Components/UI/Heading/Heading';
import { Eye, ShoppingBag, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

function page() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await safeFetch('/api/catagories', {}, 3600000);
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

  const performAction = (cat, subCat) => {
    const query = new URLSearchParams({
      category: cat,
      subcategory: subCat,
    }).toString();
    router.push(`/Collections?${query}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        </div>
        
        <div className="relative text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 mx-4 max-w-lg border border-gray-200/60">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <span className="text-3xl text-white">⚠️</span>
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error}</p>
          <button
            onClick={fetchCategories}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 overflow-hidden shadow-xl hover:shadow-2xl"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Try Again
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-green-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

      <div className="relative z-1">
        <Heading icon={'🛍️'} name={'Shop Categories'} />
        
        <div className="bg-white/70 backdrop-blur-xl shadow-xl border-b border-gray-200/60 relative">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl mb-6 border border-gray-200/60 shadow-lg">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold uppercase tracking-wider text-gray-600">Premium Collections</span>
              </div>
              
              <p className="text-gray-600 text-md font-light max-w-3xl mx-auto leading-relaxed">
                Discover our carefully curated collection of premium products across all categories, 
                designed for those who appreciate quality and style.
              </p>
              
           
            </div>
          </div>
        </div>
      </div>
      
   
      <div className="relative z-1 max-w-7xl mx-auto px-6 py-16">
        {categoriesData.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <span className="text-6xl opacity-60">🏪</span>
            </div>
            <h2 className="text-4xl font-black text-gray-700 mb-4">No Categories Available</h2>
            <p className="text-gray-500 text-xl leading-relaxed max-w-md mx-auto">
              Categories will appear here once our products are organized and ready for you.
            </p>
          </div>
        ) : (
          <>
         
            <div className="text-center mb-16">
              <h2 className="md:text-4xl text-3xl md:text-5xl font-black text-gray-800 mb-6 tracking-tight">
                Browse by Category
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoriesData.map((category, index) => (
                <div
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-200/60 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                > 
                 
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
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
                    
              
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
             
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-gray-700">Available</span>
                      </div>
                    </div>

        
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                      <Eye className="w-6 h-6 text-white" />
                    </div>

                   
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        onClick={() => performAction(category.cat, category.subCat)}
                        className="w-full bg-white/95 backdrop-blur-sm text-gray-800 py-3 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg border border-white/50"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Shop Now
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {category.name}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                      Explore our premium collection of {category.name.toLowerCase()} items
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Premium Quality
                      </div>
                      <button
                        onClick={() => performAction(category.cat, category.subCat)}
                        className="group/btn flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
                      >
                        View All
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>

                
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-3xl" />
                  
                 
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

     
     
    </div>
  );
}

export default page;