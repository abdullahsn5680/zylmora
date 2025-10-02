'use client'
import React from 'react'

function ExploreMoreSkeleton() {
  return (
    <div className="text-center w-full">
      <div className="inline-block p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 w-full backdrop-blur-sm border border-indigo-500/20 shadow-[0_25px_80px_rgba(0,0,0,0.5)] rounded-2xl relative overflow-hidden">
      
      
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite]" style={{ animationDelay: '1s' }} />

       
        <div className="relative z-10">
         
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-600/80 to-purple-600/80 rounded-2xl relative overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.4)] border border-indigo-400/30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white/30 rounded-lg animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            </div>
          </div>

        
          <div className="h-8 w-64 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 mx-auto rounded-xl mb-6 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                 style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          </div>

         
          <div className="space-y-3 mb-8">
            <div className="h-4 w-3/4 max-w-md bg-gradient-to-r from-slate-700/80 to-slate-600/80 mx-auto rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                   style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="h-4 w-2/3 max-w-sm bg-gradient-to-r from-slate-700/80 to-slate-600/80 mx-auto rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                   style={{ animationDelay: '0.7s' }} />
            </div>
          </div>

         
          <div className="h-14 w-72 max-w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mx-auto rounded-2xl relative overflow-hidden shadow-[0_10px_40px_rgba(99,102,241,0.5)] border border-indigo-400/40">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                 style={{ animationDelay: '0.9s' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <div className="h-4 w-32 bg-white/60 rounded-full" />
              <div className="h-4 w-4 bg-white/50 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            </div>
          </div>

        
          <div className="flex gap-2 justify-center mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 bg-indigo-500/60 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
                style={{ animationDelay: `${1.1 + i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

     
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

      </div>

    
    </div>
  )
}

export default ExploreMoreSkeleton