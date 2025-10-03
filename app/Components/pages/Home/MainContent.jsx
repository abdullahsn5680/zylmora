import { Star, Sparkles, TrendingUp, Award, Zap, Shield, Truck, RotateCcw } from 'lucide-react'
import React from 'react'
import CardContainer from '../../UI/Container/CardContainer'

function MainContent({content}) {
  return (
    <div className="containers w-full px-2 md:px-8 lg:px-16 xl:px-20 py-8 relative">
      
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-20 w-56 h-56 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000" />
      </div>

      
      <div className="text-center mb-12 relative z-1">
        
        
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-md rounded-full mb-4 border-2 border-purple-200/60 shadow-lg">
          <Star className="w-4 h-4 text-purple-600 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Featured 2025</span>
          <TrendingUp className="w-4 h-4 text-blue-600" />
        </div>

       
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 tracking-tight leading-[1.1]">
          Premium Fashion
        </h2>

      
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700 mb-6 tracking-tight">
          Discover Timeless Elegance & Modern Style
        </h3>
        
      
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent to-blue-400 rounded-full" />
          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-lg" />
          <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-xl" />
          <div className="w-2 h-2 bg-pink-500 rounded-full shadow-lg" />
          <div className="w-12 h-1 bg-gradient-to-l from-transparent to-pink-400 rounded-full" />
        </div>

        
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-6 px-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-gray-700">Fast</div>
              <div className="text-xs text-gray-500">Delivery</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-gray-700">100%</div>
              <div className="text-xs text-gray-500">Authentic</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-gray-700">Easy</div>
              <div className="text-xs text-gray-500">Returns</div>
            </div>
          </div>
        </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 border border-green-200 shadow-md">
            <Zap className="w-3 h-3 text-green-600" />
            New Arrivals
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 border border-yellow-200 shadow-md">
            <Star className="w-3 h-3 text-yellow-600" />
            Bestsellers
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 border border-purple-200 shadow-md">
            <Award className="w-3 h-3 text-purple-600" />
            Premium Quality
          </span>
        </div>
      </div>

     
      <div className="space-y-16 relative z-1 mb-20">
        {content?.Items?.map((data, index) => (
          <div
            key={data.id}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'both'
            }}
          >
            <CardContainer prop={data} />
          </div>
        ))}
      </div>

      <div className="relative z-1">
        
    
        <div className="relative mb-16">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent rounded-full" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-white rounded-full border-3 border-purple-300 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            </div>
          </div>
        </div>

       
        <div className="text-center max-w-6xl mx-auto space-y-12 pb-16">
          
          
          <div className="bg-gradient-to-br from-white/80 to-purple-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-100">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-purple-300 rounded-full" />
              <Award className="w-6 h-6 text-purple-600 animate-pulse" />
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-purple-300 rounded-full" />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
              Why Choose Our Collection?
            </h3>
            
            <div className="max-w-3xl mx-auto space-y-4 text-left">
              <p className="text-base md:text-lg leading-relaxed text-gray-700 font-medium">
                Explore our meticulously handpicked collections of premium fashion items, where exceptional craftsmanship meets contemporary design. Each piece is thoughtfully curated to bring you the perfect blend of quality, style, and sophistication.
              </p>
              
              <p className="text-sm md:text-base leading-relaxed text-gray-600">
                From timeless classics to cutting-edge trends, discover exclusive pieces that define your unique style and elevate your wardrobe. Experience the art of fashion with collections designed for those who demand nothing but the best.
              </p>
            </div>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-100 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                24/7
              </div>
              <div className="text-sm font-bold text-gray-700 mb-1">Support Available</div>
              <div className="text-xs text-gray-500">Always here to help you</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                100%
              </div>
              <div className="text-sm font-bold text-gray-700 mb-1">Authentic Items</div>
              <div className="text-xs text-gray-500">Verified premium quality</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-pink-100 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-600 mb-2">
                Fast
              </div>
              <div className="text-sm font-bold text-gray-700 mb-1">Global Delivery</div>
              <div className="text-xs text-gray-500">Shipping worldwide</div>
            </div>
          </div>

         
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <span className="flex items-center gap-2 px-5 py-3 bg-white/90 rounded-xl text-sm font-semibold text-gray-700 shadow-lg border border-green-200">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Quality
            </span>
            
            <span className="flex items-center gap-2 px-5 py-3 bg-white/90 rounded-xl text-sm font-semibold text-gray-700 shadow-lg border border-blue-200">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free Shipping
            </span>
            
            <span className="flex items-center gap-2 px-5 py-3 bg-white/90 rounded-xl text-sm font-semibold text-gray-700 shadow-lg border border-purple-200">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Easy Returns
            </span>
          </div>

          
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl mt-8">
            <Sparkles className="w-8 h-8 mx-auto mb-4 animate-pulse" />
            <h4 className="text-2xl md:text-3xl font-black mb-3">
              Start Your Fashion Journey Today
            </h4>
            <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their premium fashion needs. Experience the difference quality makes.
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default MainContent