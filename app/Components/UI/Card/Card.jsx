'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AddCart from '../Buttons/AddCart';

function Card({ prop, isRelated }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const router = useRouter();

  const savingsAmount = prop.discount !== 0 ? prop.price - prop.cut_price : 0;
  const isOnSale = prop.discount > 0;
  const isNew = prop.discount !== 0;
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
      className={`group relative flex flex-col ${related && 'w-[180px] md:w-[280px]'} ${!related && 'w-full'} mx-auto transition-all duration-300 ease-out cursor-pointer motion-reduce:transform-none`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div
        className={`relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ease-out
        hover:shadow-lg ${isHovered ? 'transform -translate-y-1 scale-105' : ''} motion-reduce:transform-none
        before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/10 before:to-white/0 before:pointer-events-none
        after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 group-hover:after:w-full after:bg-gradient-to-r after:from-slate-300 after:to-slate-800 after:transition-all`}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl">
          <div className={`transition-opacity duration-500 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Image
              loading="lazy"
              width={800}
              height={800}
              src={prop.main_image}
              alt={prop.title}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-2 z-2">
            {isNew && (
              <div className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] md:text-xs font-semibold rounded-full shadow-sm border border-slate-200">
                NEW
              </div>
            )}
            {isOnSale && (
              <div className="px-2 py-0.5 bg-slate-800 text-white text-[10px] md:text-xs font-semibold rounded-full shadow-sm border border-slate-900/20">
                {prop.discount}% OFF
              </div>
            )}
          </div>

          <div className={`absolute top-3 right-3 z-2 transition-all duration-300 ease-out ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />

          <div
            className={`absolute bottom-3 md:bottom-5 left-2 right-2 z-1 transition-all duration-300 ease-out
            ${isHovered ? 'opacity-30 blur-sm translate-y-2' : 'opacity-100 blur-none translate-y-0'}`}
          >
            <div className="flex justify-center gap-1.5 flex-wrap">
              {prop.sizes.map((sizeData) => (
                <button
                  key={sizeData._id}
                  onClick={(e) => handleSizeSelect(sizeData.size, e)}
                  className={`w-5 h-5 md:w-8 md:h-8 rounded-full text-[10px] md:text-xs font-semibold
                    transition-all duration-300 ease-out shadow-sm border border-slate-200
                    flex items-center justify-center
                    ${selectedSize === sizeData.size
                      ? 'bg-slate-800 text-white scale-105'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 transition-colors'}`}
                >
                  {sizeData.size}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`absolute inset-0 transition-all duration-300 ease-out
            ${isHovered ? 'md:bg-slate-800/20 md:backdrop-blur-sm opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              <div className="hidden md:block bg-slate-100 text-slate-800 px-4 py-2 rounded-md shadow-sm border border-slate-200 font-medium text-sm transition-colors duration-300 hover:bg-slate-800 hover:text-white hover:shadow-lg hover:scale-105">
                Quick View
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 md:px-5 md:py-5 space-y-2 md:space-y-3">
          <div className="w-full md:hidden">
            <AddCart prop={prop} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base md:text-lg font-bold text-slate-800 leading-relaxed group-hover:text-slate-900 transition-colors duration-300">
              {prop.title}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex text-slate-600 text-sm">{'★★★★☆'}</div>
              <span className="text-xs text-slate-500">(4.2)</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isOnSale && (
                <span className="text-slate-400 line-through text-sm font-medium">
                  Rs {formatPrice(prop.price)}
                </span>
              )}
              <span className="text-slate-800 font-bold text-base md:text-lg">
                Rs {formatPrice(prop.cut_price)}
              </span>
            </div>

            {savingsAmount > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full">
                <span className="text-green-600 text-xs font-medium">
                  You save Rs {formatPrice(savingsAmount)}
                </span>
                <span className="text-green-600 text-xs">💰</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-green-100 text-green-600">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-slate-600">Available</span>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${isHovered ? 'shadow-2xl' : ''}`} />
      </div>
    </div>
  );
}

export default Card;
