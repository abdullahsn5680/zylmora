'use client'
import { UserContext } from '@/app/Context/contextProvider'
import { safeFetchImage, useCachedImage } from '@/Utils/safeFetch'
import { ShoppingBag, Star, Sparkles, TrendingUp, Award, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

function Hero({content}) {
  const router = useRouter()
  const { session } = useContext(UserContext);
  const [Url, setUrl] = useState()

  useEffect(() => {
    if(content?.banner_Url){
      const fetch = async() => {
        const imageUrl = await safeFetchImage(content?.banner_Url, 86400000, session);
        setUrl(imageUrl)
      }
      fetch();
    }
  }, [content])
  
  return (
    <div className="relative hero md:py-8 sm:px-6 lg:px-8 text-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
       
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
        
        <div className="relative mb-12 md:mt-10 md:rounded-3xl overflow-hidden shadow-2xl group">
          <div className="relative aspect-[2/3.5] sm:aspect-[16/6] lg:aspect-[21/9]">
            
           
            {Url && (
              <Image
                src={Url}
                alt="Premium Fashion Collection"
                fill
                priority           
                loading="eager"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
             
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
            </div>
            
          
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl mx-auto px-8 text-center lg:text-left lg:mx-8 lg:ml-16">
                
             
                       <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group/badge">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span className="text-sm font-bold text-white tracking-wide">Premium Fashion Collection</span>
                  <Award className="w-4 h-4 text-yellow-300 group-hover/badge:rotate-12 transition-transform" />
                </div>
                
   
                <h1 className="xxs:text-xl text-[2.5rem] lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                  Discover Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                    Perfect Style
                  </span>
                </h1>
                
              
                <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                </div>
                
              
                <p className="text-xs lg:text-lg text-gray-100 mb-8 leading-relaxed max-w-lg font-medium">
                  Explore our curated collection of premium fashion items, designed for those who appreciate quality and style.
                </p>
          
                                <div className="grid grid-cols-3 items-center gap-2 mb-8 justify-center lg:justify-start">
                  <div className="flex items-center md:gap-2 gap-1 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <span className="text-[7px] md:text-xs font-bold text-white">Trending Now</span>
                  </div>
                  <div className="flex items-center md:gap-2 gap-1 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-[7px] md:text-xs font-bold text-white">Premium Quality</span>
                  </div>
                  <div className="flex items-center md:gap-2 gap-1 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <ShoppingBag className="w-4 h-4 text-blue-300" />
                    <span className="text-[7px] md:text-xs font-bold text-white">Free Shipping</span>
                  </div>
                </div>
                
 
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => {router.push('./Catagories')}} 
                    className="group/btn relative px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center gap-2 group-hover/btn:text-white transition-colors">
                      <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      Shop Collection
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  
                  {/* <button className="group/btn relative px-8 py-4 bg-white/10 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">
                      <Star className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" />
                      View Lookbook
                    </span>
                  </button> */}
                </div>
              </div>
            </div>
            
         
            <div className="absolute bottom-4 right-4 left-4 lg:bottom-8 lg:right-8 lg:left-auto flex flex-wrap gap-3 justify-center lg:justify-end">
              <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold text-gray-800">50+ New Arrivals</span>
              </div>
              <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] md:text-xs font-bold text-gray-800">4.9 Rating</span>
              </div>
            </div>
          </div>
        </div>

      </div>
   
    
    </div>
  )
}

export default Hero