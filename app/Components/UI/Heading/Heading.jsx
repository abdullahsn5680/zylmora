'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft } from 'lucide-react'

function Heading({ name, icon }) {
  const router = useRouter();
  
  return (
    <div className="relative bg-gradient-to-r w-full from-white via-gray-50/50 to-white backdrop-blur-xl  border-b border-gray-200/60 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-20 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute top-0 right-20 w-28 h-28 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex  flex-col sm:flex-row   md:items-start sm:items-center md:justify-between gap-4 sm:gap-6">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="group relative md:flex  hidden gap-3 px-5 py-3 bg-white/90 hover:bg-white rounded-2xl text-gray-700 hover:text-gray-900 transition-all duration-300 border border-gray-200/60 shadow-md hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
          >
          
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
          
            <div className="relative z-10 w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:from-blue-500 group-hover:to-purple-500">
              <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
            </div>
            
            <span className="relative z-10 text-sm sm:text-base font-bold">Back</span>
          </button>
          
          {/* Heading Content */}
          <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
            
            <div className="relative group/icon">
             
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-50 transition-opacity duration-500" />
              
              
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl flex items-center justify-center shadow-xl border border-gray-700/50 transition-all duration-500 group-hover/icon:scale-110 group-hover/icon:rotate-6 overflow-hidden">
              
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                
                <span className="relative text-2xl sm:text-3xl lg:text-4xl transform transition-transform duration-500 group-hover/icon:scale-110">
                  {icon}
                </span>
              </div>
            </div>
            
         
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 tracking-tight leading-tight">
                {name}
              </h1>
              
             
              <div className="mt-2 flex items-center gap-2">
                <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
                <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  )
}

export default Heading