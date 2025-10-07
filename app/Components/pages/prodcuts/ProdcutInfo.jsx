'use client'
import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAlert } from '@/app/Provider/Alert/AlertProvider'
import { safeFetch, safeFetchImage } from '@/Utils/safeFetch'
import { useLoader } from '@/app/Provider/loader/loaderProvider'

function ProductInfo({
  product,
  Size,
  setSize,
  Counter,
  setCounter,
  session,
  setShowOrderForm
}) {
  const {showAlert} = useAlert();
  const {showLoader, hideLoader} = useLoader();
  const router = useRouter();
  const isInStock = product.stock != 0;





  const handleAddWishlist = async () => {
    if (!product) return;
    if (!session?.user?.email) return handelLogin();
    
    try {
      showLoader();
      const res = await safeFetch('/api/Wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, product }),
      });

      await res
      hideLoader();
      showAlert.success("Added to wishlist successfully");
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      showAlert.error("Unable to add to wishlist")
    }
  };

  const handleAddCart = async () => {
    if (!Size || !product) return;
    if (!session?.user?.email) return handelLogin();

    try {
      showLoader();
      const res = await safeFetch('/api/Cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          product,
          quantity: Counter,
          size: Size.size || Size,
        }),
      });

      await res
      hideLoader();
      showAlert.success("Added to cart successfully");
    } catch (err) {
      console.error('Error adding to cart:', err);
      showAlert.error("Unable to load to cart")
    }
  };

  const handleBuyNow = () => {
    if (!Size || !session?.user?.email || !isInStock) return handelLogin();
    setShowOrderForm(true);
  };
  
  const handelLogin = () => {
    showAlert.confirm('You need to be logged in to continue. Would you like to login now?',
      () => {router.push('/Authentication')}, 
      {
        title: "Login Required",
        confirmText: "Login",
        cancelText: "Cancel",
        onCancel: () => {console.log('User cancel the action')}
      })
  }

  return (
    <div className="main flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 px-4 sm:px-6 lg:px-12 mb-16 relative">
     
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
      </div>

      <div className="relative w-full lg:w-[45%] group">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white via-gray-50/80 to-white shadow-2xl border border-gray-200/60 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-700 ease-out">
         
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
       
          <Image
            width={800}
            height={800}
            src={product?.main_image || '/placeholder.png'}
            alt={product?.title || 'Product'}
            className="w-full h-full object-cover rounded-3xl transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
          />
          
        
          {product?.discount > 0 && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg border border-white/20 backdrop-blur-sm animate-pulse">
              🔥 {product.discount}% OFF
            </div>
          )}
        </div>
      </div>

   
      <div className="info w-full lg:w-[50%] flex flex-col justify-start bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/60 hover:shadow-2xl hover:shadow-gray-500/10 transition-all duration-500 relative">
       
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-8 left-6 w-8 h-8 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full opacity-30 animate-bounce" />

      
        <div className="text-center mb-10 lg:mb-16 relative">
          <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 mb-6 leading-tight">
            {product?.title || 'Premium Product'}
          </h1>
          
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-white rounded-full" />
        </div>

        
        <div className="p_info text-gray-600 mb-8 space-y-3 bg-gray-50/50 rounded-2xl p-6 border border-gray-200/40">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800 text-lg">Vendor:</span>
            <span className="text-gray-700 font-medium bg-white px-3 py-1 rounded-full shadow-sm">
              {product?.Vendor || 'Premium Brand'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800 text-lg">Category:</span>
            <span className="text-gray-700 font-medium bg-white px-3 py-1 rounded-full shadow-sm">
              {product?.subcategory || 'Fashion'}
            </span>
          </div>
        </div>

     
        <div className="sizes mb-8">
          <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
            Size Selection
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {(product?.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((size, index) => (
              <button
                key={index}
                onClick={() => setSize(size)}
                className={`relative px-4 py-3 border-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 transform overflow-hidden group ${
                  Size === size || Size?.size === size.size
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-transparent shadow-lg scale-105'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:shadow-md'
                }`}
              >
                
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                <span className="relative text-sm lg:text-base">
                  {size.size || size}
                </span>
              </button>
            ))}
          </div>
        </div>

     
        <div className="mb-8 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            {product?.price && product?.cut_price && product.price !== product.cut_price && (
              <span className="text-xl text-gray-400 line-through bg-gray-100 px-3 py-1 rounded-lg">
                PKR {product.price}
              </span>
            )}
            <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900">
              PKR {product?.cut_price || '0'}
            </div>
          </div>
          {product?.price && product?.cut_price && product.price !== product.cut_price && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <span className="text-green-700 font-bold">
                Save PKR {product.price - product.cut_price}
              </span>
              <span className="text-green-600">💰</span>
            </div>
          )}
        </div>

     
        <div className="order mb-8">
          <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" />
            Quantity
          </h3>
          
          <div className="flex items-center gap-4 mb-6">
           
            <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <button 
                className="px-6 py-3 text-gray-600 hover:text-white hover:bg-gray-800 transition-all duration-300 font-bold text-lg"
                onClick={() => Counter > 1 && setCounter(Counter - 1)}
              >
                −
              </button>
              <div className="px-8 py-3 border-l-2 border-r-2 border-gray-200 font-black text-gray-800 bg-gray-50 text-lg">
                {Counter}
              </div>
              <button 
                className="px-6 py-3 text-gray-600 hover:text-white hover:bg-gray-800 transition-all duration-300 font-bold text-lg"
                onClick={() => setCounter(Counter + 1)}
              >
                +
              </button>
            </div>
            
          
            <button
              onClick={handleAddWishlist}
              className="group relative p-4 bg-white text-gray-800 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white hover:scale-110 rounded-xl transition-all duration-300 border-2 border-gray-200 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <Heart className="w-6 h-6 relative z-10" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddCart}
              disabled={!Size}
              className={`group relative flex-1 py-4 px-8 rounded-xl font-bold transition-all duration-300 overflow-hidden ${
                !Size 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-200' 
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 border-2 border-transparent'
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative text-lg">🛒 Add to Cart</span>
            </button>
          </div>

         
          <div className="buyNowBtn">
            {isInStock ? (
              <button
                onClick={handleBuyNow}
                disabled={!Size || !isInStock}
                className={`group relative w-full py-4 px-8 rounded-xl font-bold transition-all duration-300 overflow-hidden ${
                  !Size 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-200' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 border-2 border-transparent'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                <span className="relative text-lg">⚡ Buy Now</span>
              </button>
            ) : (
              <div className="w-full py-4 px-8 text-center rounded-xl font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl border-2 border-transparent text-lg">
                ❌ Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>

     
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

export default ProductInfo