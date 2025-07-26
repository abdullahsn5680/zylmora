'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AddCart from '../Buttons/AddCart';

function Card({ prop }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const router = useRouter();

  
  const savingsAmount = prop.discount != 0 ? (prop.price - prop.cut_price) : 0;
  

  const isOnSale = prop.discount > 0;
  
  
  const isNew = prop.discount != 0; 

  
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCardClick = () => {
   
    router.push(`/product/${prop._id}`);
  };

  const handleSizeSelect = (size, e) => {
    e.stopPropagation();
    setSelectedSize(selectedSize === size ? null : size);
  };

  return (
    <div 
      className='group relative flex flex-col mx-auto w-[96%] md:max-w-sm lg:max-w-md transition-all duration-500 ease-out cursor-pointer'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
   
      <div className={`
        relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden
        shadow-lg hover:shadow-2xl transition-all duration-500 ease-out
        ${isHovered ? 'transform -translate-y-3 scale-[1.02]' : ''}
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
      `}>
        
      
        <div className="relative w-full aspect-square overflow-hidden rounded-t-3xl">
          <div className={`
            transition-all duration-700 ease-out
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}>
            <Image
              width={800}
              height={800}
              src={prop.main_image}
              alt={prop.title}
              className={`
                w-full h-full object-cover transition-all duration-700 ease-out
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

        
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
            </div>
          )}

        
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {isNew && (
              <div className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                NEW
              </div>
            )}
            {isOnSale && (
              <div className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/20 animate-pulse">
                {prop.discount}% OFF
              </div>
            )}
          </div>

          <div className={`
            absolute top-3 right-3 z-20 transition-all duration-300 ease-out
            ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
          `}>
            <button 
              className="w-8 h-8 md:w-10 md:h-10 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
     
              }}
            >
              <span className="text-sm md:text-lg">♡</span>
            </button>
          </div>

          <div className={`
            absolute bottom-3 left-3 right-3 z-10 transition-all duration-500 ease-out
            ${isHovered 
              ? 'md:opacity-30 md:blur-sm opacity-0 translate-y-2' 
              : 'md:opacity-100 md:blur-none opacity-0 md:translate-y-0 translate-y-2'
            }
          `}>
            <div className="flex justify-center gap-1.5 flex-wrap">
              {prop.sizes.map((sizeData) => (
                <button
                  key={sizeData._id}
                  onClick={(e) => handleSizeSelect(sizeData.size, e)}
                  className={`
                    w-7 h-7 md:w-9 md:h-9 rounded-full text-[10px] md:text-xs font-bold
                    transition-all duration-300 ease-out shadow-lg backdrop-blur-md border border-white/30
                    flex items-center justify-center
                    ${selectedSize === sizeData.size 
                      ? 'bg-slate-800 text-white scale-110 shadow-xl' 
                      : 'bg-white/95 text-slate-700 hover:bg-slate-100 hover:scale-105'
                    }
                  `}
                >
                  {sizeData.size}
                </button>
              ))}
            </div>
          </div>

          <div className={`
            absolute inset-0 transition-all duration-500 ease-out
            ${isHovered 
              ? 'md:bg-black/20 md:backdrop-blur-sm opacity-100' 
              : 'opacity-0 pointer-events-none bg-transparent'
            }
          `}>
            <div className={`
              absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out
              ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
            `}>
              <div className="hidden md:block bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/20 text-slate-800 font-medium text-sm hover:bg-white transition-all duration-300">
                Quick View
              </div>
            </div>
          </div>
        </div>

       
        <div className="p-4 md:p-6 space-y-4">
       
          <div className="w-full md:hidden">
            <AddCart prop={prop} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-semibold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-slate-900 transition-colors duration-300">
              {prop.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 text-sm">
                {'★★★★☆'}
              </div>
              <span className="text-xs text-slate-500">(4.2)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {isOnSale && (
                <span className="text-slate-400 line-through text-sm md:text-base font-medium">
                  Rs {formatPrice(prop.price)}
                </span>
              )}
              <span className="text-slate-800 font-bold text-lg md:text-xl">
                Rs {formatPrice(prop.cut_price)}
              </span>
            </div>
            
           
            {savingsAmount > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                <span className="text-green-600 text-xs font-medium">
                  You save Rs {formatPrice(savingsAmount)}
                </span>
                <span className="text-green-600 text-xs">💰</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-600">In Stock</span>
            </div>
            {/* <span className="text-slate-500">Free Shipping</span> */}
          </div>
        </div>

        <div className={`
          absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500
          ${isHovered ? 'shadow-2xl shadow-blue-500/10' : ''}
        `}></div>
      </div>
    </div>
  )
}

export default Card;