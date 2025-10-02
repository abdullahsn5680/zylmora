'use client'
import React from 'react'

function MainContentSkeleton() {
  return (
    <div className="containers w-full px-2 md:px-8 lg:px-16 xl:px-20 py-6">
    
      {/* Header Section */}
      <div className="text-center mb-16 relative">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl mb-6 border border-indigo-300/30 backdrop-blur-sm shadow-[0_8px_30px_rgba(99,102,241,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            <div className="h-4 w-32 bg-slate-700/60 rounded-full" />
          </div>
          
          {/* Main Heading */}
          <div className="h-8 md:h-12 w-64 md:w-96 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 mx-auto rounded-xl mb-6 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                 style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          </div>
          
          {/* Decorative divider */}
          <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 mx-auto rounded-full mb-6 shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          
          {/* Description */}
          <div className="space-y-3">
            <div className="h-4 w-3/4 max-w-2xl bg-gradient-to-r from-slate-700/70 to-slate-600/70 mx-auto rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/15 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                   style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="h-4 w-2/3 max-w-xl bg-gradient-to-r from-slate-700/70 to-slate-600/70 mx-auto rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/15 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                   style={{ animationDelay: '0.7s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden relative group"
          >
            {/* Card background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Image placeholder */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" 
                   style={{ animationDelay: `${i * 0.3}s` }} />
              
              {/* Play button or icon indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-slate-800/60 backdrop-blur-md rounded-full border border-slate-600/50 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                       style={{ animationDelay: `${1 + i * 0.3}s` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-indigo-400 border-b-8 border-b-transparent ml-1" />
                  </div>
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-lg">
                <div className="h-3 w-12 bg-slate-600 rounded-full" />
              </div>
            </div>

            {/* Content section */}
            <div className="p-6 space-y-4 relative">
              {/* Title */}
              <div className="h-6 w-3/4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                     style={{ animationDelay: `${1.5 + i * 0.2}s` }} />
              </div>
              
              {/* Subtitle/Category */}
              <div className="h-4 w-1/2 bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/15 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                     style={{ animationDelay: `${1.7 + i * 0.2}s` }} />
              </div>

              {/* Tags/Categories */}
              <div className="flex gap-3 mt-4">
                <div className="h-8 w-24 bg-gradient-to-r from-indigo-600/40 to-purple-600/40 rounded-xl relative overflow-hidden border border-indigo-500/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                       style={{ animationDelay: `${1.9 + i * 0.2}s` }} />
                </div>
                <div className="h-8 w-20 bg-gradient-to-r from-slate-700/60 to-slate-600/60 rounded-xl relative overflow-hidden border border-slate-600/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                       style={{ animationDelay: `${2.1 + i * 0.2}s` }} />
                </div>
              </div>

              {/* Meta info (views, date, etc.) */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-indigo-500/50 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" 
                       style={{ animationDelay: `${2.3 + i * 0.2}s` }} />
                  <div className="h-3 w-16 bg-slate-700/70 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/15 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                         style={{ animationDelay: `${2.5 + i * 0.2}s` }} />
                  </div>
                </div>
                <div className="h-1 w-1 bg-slate-600 rounded-full" />
                <div className="h-3 w-20 bg-slate-700/70 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/15 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                       style={{ animationDelay: `${2.7 + i * 0.2}s` }} />
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          </div>
        ))}
      </div>

  
    </div>
  )
}

export default MainContentSkeleton