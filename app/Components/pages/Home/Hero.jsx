import { ShoppingBag } from 'lucide-react'
import { Star } from 'lucide-react'
import { Sparkle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function Hero({content}) {
  return (
    <div className="relative hero md:py-8  sm:px-6 lg:px-8 text-gray-800">
        <div className="max-w-7xl mx-auto">
          
          
          <div className="relative mb-12 md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60">
            <div className="relative aspect-[2/3] sm:aspect-[16/6] lg:aspect-[21/9]">
              <Image
                src="/banner/banner.png"
                alt="Premium Fashion Collection"
                fill
                className="object-cover"
                priority
              />
             
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              
            
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-2xl mx-auto px-8 text-center lg:text-left lg:mx-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                    <Sparkle className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Premium Fashion Collection</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
                    Discover Your
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Perfect Style
                    </span>
                  </h1>
                  
                  <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-lg">
                    Explore our curated collection of premium fashion items, designed for those who appreciate quality and style.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button className="group relative px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold transition-all duration-300 hover:scale-105 overflow-hidden shadow-xl">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative flex items-center justify-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Shop Collection
                      </span>
                    </button>
                    
                    <button className="group relative px-8 py-4 bg-transparent text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm">
                      <span className="relative flex items-center justify-center gap-2">
                        <Star className="w-5 h-5" />
                        View Lookbook
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  )
}

export default Hero
