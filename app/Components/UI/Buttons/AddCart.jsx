'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
function AddCart({prop}) {
  const router = useRouter();
  const performAction = (url) => {

       const query = new URLSearchParams({
      url:url,
      
    }).toString();
        const path =`/products?${query}`
    router.push(path)
   
  }
  
  return (
 <div className='w-full'>
  <button 
    onClick={() => performAction(prop._id)} 
    type="button" 
    className="group relative w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold text-[8px] md:text-base px-2 py-1.5 md:px-6 md:py-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-slate-300/50 active:scale-95 overflow-hidden"
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      <span className="transition-all duration-300 group-hover:scale-105">
        Quick Add
      </span>
      <span className="text-[9px] group-hover:translate-x-1 transition-transform duration-300">
        ⚡
      </span>
    </span>

    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
  </button>
</div>
  )
}

export default AddCart
