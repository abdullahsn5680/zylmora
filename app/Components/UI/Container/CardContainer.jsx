'use client';
import React, { memo } from 'react';
import Card from '../Card/Card';
import { useRouter } from 'next/navigation';

const CardContainer = memo(function CardContainer({ prop }) {
  const router = useRouter();
  
  const performAction = (url) => {
    router.push(url);
  };

  return (
    <div className='w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 mb-16 py-3 md:p-6 lg:p-8 rounded-3xl relative overflow-hidden'>
     
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-20 right-20 w-24 h-24 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000" />
      </div>

     
      <div className="info min-h-[180px] md:min-h-[220px] flex flex-col justify-center items-center gap-6 text-center relative z-1 mb-8">
      
        <div className="relative">
          <h2 className="font-black text-2xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 tracking-tight leading-tight">
            {prop.heading}
          </h2>
          
        
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />
        </div>

      
        <button
          onClick={() => { performAction(prop?.url) }}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-8 py-4 font-bold text-white transition-all duration-500 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 hover:-translate-y-1 active:scale-95"
        >
          
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500" />
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
          
      
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
        
          <span className="relative flex items-center gap-3 text-base md:text-lg font-bold">
            <span className="transition-transform duration-300 group-hover:scale-110">✨</span>
            <span>View All Products</span>
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5-5 5M6 12h12"
              />
            </svg>
          </span>

        
          <span className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400 transition-all duration-500 group-hover:w-full rounded-full" />
        </button>

        <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Discover our handpicked collection of premium products
        </p>
      </div>

      <div className="items w-full max-w-7xl mx-auto">
        <div className="grid gap-2 md:gap-6 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 justify-center">
          {prop.products.map((data, index) => (
            <div
              key={data._id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <Card prop={data} />
            </div>
          ))}
        </div>
      </div>

     
      <div className="relative mt-16 mb-8">
      
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
        
       
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </div>
        </div>

       
        <div className="absolute top-0 left-8 transform -translate-y-1/2 w-2 h-2 bg-blue-200 rounded-full opacity-60" />
        <div className="absolute top-0 right-8 transform -translate-y-1/2 w-2 h-2 bg-purple-200 rounded-full opacity-60" />
        <div className="absolute top-0 left-16 transform -translate-y-1/2 w-1 h-1 bg-pink-200 rounded-full opacity-40" />
        <div className="absolute top-0 right-16 transform -translate-y-1/2 w-1 h-1 bg-indigo-200 rounded-full opacity-40" />
      </div>

     
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Enhanced floating animations */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Gradient text shimmer */
        @keyframes shimmer-text {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #374151, #6b7280, #374151);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer-text 3s linear infinite;
        }

        /* Button pulse effect */
        @keyframes button-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .animate-pulse-ring {
          animation: button-pulse 2s infinite;
        }
      `}</style>
    </div>
  );
});

export default CardContainer;