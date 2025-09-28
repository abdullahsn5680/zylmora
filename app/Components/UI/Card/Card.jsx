'use client';
import React, { memo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AddCart from '../Buttons/AddCart';

const Card = memo(function Card({ prop, isRelated }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const router = useRouter();

  const savingsAmount = prop.discount !== 0 ? prop.price - prop.cut_price : 0;
  const isOnSale = prop.discount > 0;
  const isNew = prop.discount !== 0;
  const isInStock = prop.stock != 0;
  const related = isRelated;

  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const handleCardClick = () => {
    router.push(`/products?url=${prop._id}`);
  };

  const handleSizeSelect = (size, e) => {
    e.stopPropagation();
    setSelectedSize(selectedSize === size ? null : size);
  };

  return (
    <div
      className={`group relative flex flex-col ${related && 'w-[180px] md:w-[280px]'} ${!related && 'w-full'} mx-auto transition-all duration-500 ease-out cursor-pointer motion-reduce:transform-none`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
   
      <div
        className={`relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-lg transition-all duration-500 ease-out
        hover:shadow-2xl hover:border-gray-200 ${isHovered ? 'transform -translate-y-2 scale-[1.02]' : ''} motion-reduce:transform-none
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-gray-50/30 before:pointer-events-none before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-t after:from-black/5 after:via-transparent after:to-white/10 after:pointer-events-none after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500`}
      >
     
        <div className="relative w-full aspect-square overflow-hidden rounded-t-3xl">
          
          <div className={`transition-opacity duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Image
              loading="lazy"
              width={800}
              height={800}
              src={prop.main_image}
              alt={prop.title}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${isHovered ? 'scale-110 brightness-105' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] transform" />
            </div>
          )}

        
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-1">
            {isNew && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                ✨ NEW
              </div>
            )}
            {isOnSale && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                🔥 {prop.discount}% OFF
              </div>
            )}
          </div>

          <div className={`absolute top-3 right-3 z-1 transition-all duration-300 ease-out ${isHovered ? 'opacity-100 scale-100' : 'opacity-70 scale-90'}`}>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group/heart transition-all duration-300 hover:scale-110 hover:bg-rose-50">
              <span className="text-gray-600 group-hover/heart:text-rose-500 transition-colors duration-300">♡</span>
            </button>
          </div>

        
          <div
            className={`absolute bottom-4 left-3 right-3 z-1 transition-all duration-500 ease-out
            ${isHovered ? 'opacity-40 blur-sm translate-y-2' : 'opacity-100 blur-none translate-y-0'}`}
          >
            <div className="flex justify-center gap-2 flex-wrap">
              {prop.sizes.map((sizeData) => (
                <button
                  key={sizeData._id}
                  onClick={(e) => handleSizeSelect(sizeData.size, e)}
                  className={`w-6 h-6 md:w-9 md:h-9 rounded-xl text-xs font-bold
                    transition-all duration-300 ease-out shadow-md border backdrop-blur-sm
                    flex items-center justify-center transform hover:scale-110
                    ${selectedSize === sizeData.size
                      ? 'bg-gray-900 text-white scale-110 border-gray-900 shadow-lg'
                      : 'bg-white/90 text-gray-700 border-white/50 hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:shadow-lg'}`}
                >
                  {sizeData.size}
                </button>
              ))}
            </div>
          </div>

        
          <div
            className={`absolute inset-0 transition-all duration-500 ease-out
            ${isHovered ? 'md:bg-black/20 md:backdrop-blur-[2px] opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              <button className="hidden md:flex bg-white/95 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-2xl shadow-xl border border-gray-200 font-bold text-sm transition-all duration-300 hover:bg-gray-900 hover:text-white hover:shadow-2xl hover:scale-105 items-center gap-2 group/quick">
                <span className="transition-transform duration-300 group-hover/quick:scale-110">👁</span>
                Quick View
              </button>
            </div>
          </div>
        </div>

       
        <div className="px-4 py-4 md:px-6 md:py-6 space-y-3 md:space-y-4">
         
          <div className="w-full md:hidden">
            <AddCart prop={prop} />
          </div>

         
          <div className="space-y-2">
            <h3 className="text-base md:text-xl font-bold text-gray-800 leading-tight group-hover:text-gray-900 transition-colors duration-300 line-clamp-2">
              {prop.title}
            </h3>
            
          
            {/* <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-sm">{'★★★★☆'}</div>
              <span className="text-xs text-gray-500 font-medium">(4.2)</span>
            </div> */}
          </div>

         
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {isOnSale && (
                <span className="text-gray-400 line-through text-sm font-medium bg-gray-100 px-2 py-1 rounded-lg">
                  Rs {formatPrice(prop.price)}
                </span>
              )}
              <span className="text-gray-900 font-bold text-lg md:text-xl bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text">
                Rs {formatPrice(prop.cut_price)}
              </span>
            </div>

            {savingsAmount > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <span className="text-green-700 text-sm font-bold">
                  Save Rs {formatPrice(savingsAmount)}
                </span>
                <span className="text-green-600">💰</span>
              </div>
            )}
          </div>

         
          <div className="flex items-center justify-between">
            {isInStock ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 text-sm font-bold">In Stock</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="text-red-700 text-sm font-bold">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

       
        <div className={`absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500 ${isHovered ? 'shadow-2xl shadow-gray-500/10' : ''}`} />
        
        
        <div className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out transform" />
        </div>
      </div>
    </div>
  );
});

export default Card;