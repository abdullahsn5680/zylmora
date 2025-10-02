'use client'
import React from 'react'

function ExploreMoreSkeleton() {
  return (
    <div className="text-center w-full animate-pulse">
      <div className="inline-block p-10 bg-white/70 w-full backdrop-blur-sm border border-gray-200/60 shadow-xl rounded-2xl">
      
        <div className="w-16 h-16 mx-auto mb-6 bg-gray-200 rounded-2xl" />

        <div className="h-8 w-64 bg-gray-300 mx-auto rounded mb-6" />

      
        <div className="h-4 w-3/4 max-w-md bg-gray-200 mx-auto rounded mb-2" />
        <div className="h-4 w-2/3 max-w-sm bg-gray-200 mx-auto rounded mb-8" />

       
        <div className="h-14 w-72 bg-gray-300 mx-auto rounded-2xl" />
      </div>
    </div>
  )
}

export default ExploreMoreSkeleton
