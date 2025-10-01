'use client'
import React from 'react'

function MainContentSkeleton() {
  return (
    <div className="containers w-full px-2 md:px-8 lg:px-16 xl:px-20 py-6 animate-pulse">
    
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-200/70 rounded-2xl mb-6 border border-gray-200/60" />
        
        <div className="h-8 md:h-12 w-64 bg-gray-300 mx-auto rounded mb-6" />
        
        <div className="w-24 h-1.5 bg-gray-300 mx-auto rounded-full mb-6" />
        
        <div className="h-4 w-3/4 max-w-2xl bg-gray-200 mx-auto rounded mb-2" />
        <div className="h-4 w-2/3 max-w-xl bg-gray-200 mx-auto rounded" />
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-3xl shadow-md overflow-hidden"
          >
           
            <div className="relative aspect-[4/3] bg-gray-200" />

           
            <div className="p-6 space-y-4">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />

              <div className="flex gap-3 mt-4">
                <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                <div className="h-8 w-20 bg-gray-200 rounded-lg" />
              </div>

              <div className="h-4 w-1/3 bg-gray-200 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainContentSkeleton
