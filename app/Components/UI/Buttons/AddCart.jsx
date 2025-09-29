'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Zap, ArrowRight } from 'lucide-react'

function AddCart({ prop }) {
  const router = useRouter();
  
  const performAction = (url) => {
    const query = new URLSearchParams({
      url: url,
    }).toString();
    const path = `/products?${query}`
    router.push(path)
  }
  
  return (
    <div className='w-full'>
      <button 
        onClick={() => performAction(prop._id)} 
        type="button" 
        className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xs md:text-base px-4 py-2.5 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300/50 active:scale-95 overflow-hidden"
      >
       
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        
       
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        
      
        <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
         
          <ShoppingCart className="w-3 h-3 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
          
         
          <span className="transition-all duration-300 group-hover:scale-105 font-black tracking-wide">
          <span  className='hidden md:black'>Quick</span> View
          </span>
          
          
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
        </span>

      
        <span className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-white/50 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
      </button>
    </div>
  )
}

export default AddCart