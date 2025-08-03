'use client'
import React from 'react'
import { Heart } from 'lucide-react'
import Image from 'next/image'

function ProdcutInfo( { product,
  Size,
  setSize,
  Counter,
  setCounter,
  handleAddWishlist,
  handleAddCart,
  handleBuyNow}) {
  return (
   <div className="main flex flex-col lg:flex-row justify-between gap-6 lg:gap-16 px-2 sm:px-4 lg:px-6 mb-16">
    
        <div className="relative w-full lg:w-[40vw]">
          <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
            <Image
              width={800}
              height={800}
              src={product?.main_image || '/placeholder.png'}
              alt={product?.title || 'Product'}
              className='w-full h-full object-contain rounded-xl hover:scale-110 transition-transform duration-500'
            />
          </div>
        </div>

      
        <div className="info w-full lg:w-1/2 flex flex-col justify-start bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
       

            <div className="text-center mb-8 lg:mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-4 lg:mb-6 tracking-wide">
          {product?.title || 'Product Title'}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-slate-300 to-slate-800 mx-auto rounded-full"></div>
        </div>
          <div className="p_info text-slate-600 mb-6 space-y-2">
            <p className="flex items-center gap-2">
              <span className="font-medium text-slate-800">Vendor:</span>
              <span className="text-slate-600">{product?.Vendor || 'Vendor'}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium text-slate-800">Category:</span>
              <span className="text-slate-600">{product?.subcategory || 'General'}</span>
            </p>
          </div>

          <div className="sizes mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Size</h3>
            <div className="flex gap-3 flex-wrap">
              {(product?.sizes || ['XS', 'M', 'L']).map((size, index) => (
                <span
                  key={index}
                  onClick={() => setSize(size)}
                  className={`cursor-pointer px-4 py-2 border-2 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                    Size === size
                      ? 'bg-slate-800 text-white border-slate-800 shadow-lg'
                      : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800'
                  }`}
                >
                  {size.size}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="text-2xl lg:text-3xl font-bold text-slate-800">
              <span className="text-lg lg:text-2xl text-slate-600">PKR</span> {product?.cut_price || '0'}
            </div>
          </div>

          <div className="order mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Quantity</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-slate-100 rounded-md border border-slate-200">
                <button 
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-all duration-300 rounded-l-md"
                  onClick={() => Counter > 1 && setCounter(Counter - 1)}
                >
                  −
                </button>
                <div className="px-6 py-2 border-l border-r border-slate-200 font-bold text-slate-800 bg-white">
                  {Counter}
                </div>
                <button 
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-all duration-300 rounded-r-md"
                  onClick={() => setCounter(Counter + 1)}
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddWishlist}
                className="p-3 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 rounded-md transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-lg"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddCart}
                disabled={!Size}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-300 ${
                  !Size 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-200' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 shadow-sm hover:shadow-lg border border-slate-200'
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>

      
          <div className="buyNowBtn">
            <button
              onClick={handleBuyNow}
              disabled={!Size}
              className={`w-full py-3 px-6 rounded-md font-medium transition-all duration-300 ${
                !Size 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-200' 
                  : 'bg-slate-800 text-white hover:bg-slate-700 hover:scale-105 shadow-sm hover:shadow-lg border border-slate-800'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
  )
}

export default ProdcutInfo