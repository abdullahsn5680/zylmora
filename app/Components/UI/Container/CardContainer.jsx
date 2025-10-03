'use client';
import React, { memo, useMemo } from 'react';
import Card from '../Card/Card';
import { useRouter } from 'next/navigation';

const CardContainer = memo(function CardContainer({ prop }) {
  const router = useRouter();
  const data = useMemo(()=>{return prop},[])
  const performAction = (url) => {
    router.push(url);
  };

  return (
    <div className='w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 mb-16 py-8 md:p-10 lg:p-12 rounded-3xl relative overflow-hidden shadow-xl'>
     
    
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse animation-delay-4000" />
      </div>

     
      <div className="info min-h-[280px] md:min-h-[320px] flex flex-col justify-center items-center gap-5 text-center relative z-1 mb-12 px-4">
      
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-purple-400 rounded-full" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-purple-600 uppercase">Premium Collection</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-400 rounded-full" />
        </div>

      
        <div className="relative mb-2">
          <h2 className="font-black text-3xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 tracking-tight leading-tight mb-3 drop-shadow-sm">
            {data.heading}
          </h2>
          
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-1 bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg" />
            <div className="w-8 h-1 bg-gradient-to-l from-transparent to-pink-500 rounded-full" />
          </div>
        </div>

     
        <p className="text-gray-700 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-2">
          Discover our handpicked collection of premium products, carefully curated to bring you the finest quality and exceptional value
        </p>

    
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-4">
          Explore exclusive deals, trending items, and customer favorites all in one place
        </p>

      
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-md border border-gray-200 flex items-center gap-2">
            <span className="text-green-500">✓</span> Free Shipping
          </span>
          <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-md border border-gray-200 flex items-center gap-2">
            <span className="text-blue-500">★</span> Top Rated
          </span>
          <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-md border border-gray-200 flex items-center gap-2">
            <span className="text-purple-500">⚡</span> Best Deals
          </span>
        </div>

       
        <button
          onClick={() => { performAction(data?.url) }}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-10 py-4 font-bold text-white transition-all duration-500 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 hover:-translate-y-1 active:scale-95 shadow-2xl"
        >
          
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500" />
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
          
       
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
         
          <span className="relative flex items-center gap-3 text-base md:text-lg font-bold">
            <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">✨</span>
            <span>Explore All Products</span>
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5-5 5M6 12h12"
              />
            </svg>
          </span>

        
          <span className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400 transition-all duration-500 group-hover:w-full rounded-full" />
        </button>

      </div>

      
      <div className="items w-full max-w-7xl mx-auto">
        <div className="grid gap-2 md:gap-6 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 justify-center">
          {data.products.map((data, index) => (
            <div
              key={data._id}
              className="animate-fade-in-up"
            >
              <Card prop={data} />
            </div>
          ))}
        </div>
      </div>

    
      <div className="relative mt-16 mb-8">
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
        
       
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-white rounded-full border-2 border-purple-300 flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
          </div>
        </div>

        
        <div className="absolute top-0 left-8 transform -translate-y-1/2 w-2 h-2 bg-blue-300 rounded-full opacity-70" />
        <div className="absolute top-0 right-8 transform -translate-y-1/2 w-2 h-2 bg-purple-300 rounded-full opacity-70" />
        <div className="absolute top-0 left-20 transform -translate-y-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-50" />
        <div className="absolute top-0 right-20 transform -translate-y-1/2 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-50" />
      </div>
      
    </div>
  );
});

export default CardContainer;