'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
function Heading({name,icon}) {
  const router = useRouter();
  return (
   <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-white/80 hover:bg-slate-100 rounded-xl sm:rounded-xl md:rounded-2xl text-slate-700 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm sm:text-base font-medium">Back</span>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-lg sm:text-xl md:text-2xl">{icon}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
            {name}
          </h1>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Heading
