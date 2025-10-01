'use client'
import React from 'react'

function HeroSkeleton() {
  return (
    <div className="relative hero md:py-8 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12 md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60">
          <div className="relative aspect-[2/3] sm:aspect-[16/6] lg:aspect-[21/9] bg-gray-300 animate-pulse">
          
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            
           
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl mx-auto px-8 text-center lg:text-left lg:mx-8">
                <div className="inline-flex items-center gap-2 px-16 py-4 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30 animate-pulse" />
                
                <div className="h-10 lg:h-16 w-64 bg-white/40 rounded-lg mb-6 animate-pulse" />
                
                <div className="h-4 w-80 bg-white/20 rounded mb-2 animate-pulse" />
                <div className="h-4 w-64 bg-white/20 rounded mb-8 animate-pulse" />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div className="h-12 w-40 bg-white/30 rounded-2xl animate-pulse" />
                  <div className="h-12 w-40 bg-white/20 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSkeleton
