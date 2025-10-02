'use client'
import React from 'react'

function HeroSkeleton() {
  return (
    <div className="relative hero md:py-8 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12 md:rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-indigo-200/30">
          <div className="relative aspect-[2/3] sm:aspect-[16/6] lg:aspect-[21/9] bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 overflow-hidden">
          
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
            
           
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            
   <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            
           
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl mx-auto px-8 text-center lg:text-left lg:mx-8 lg:ml-12">
                
               
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-md rounded-full mb-6 border border-white/40 shadow-[0_0_30px_rgba(99,102,241,0.3)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                  <div className="h-2 w-2 bg-indigo-400 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                  <div className="h-3 w-24 bg-white/60 rounded-full" />
                </div>
                
              
                <div className="space-y-3 mb-6">
                  <div className="h-10 lg:h-16 w-64 lg:w-96 bg-gradient-to-r from-white/50 via-white/60 to-white/50 rounded-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(255,255,255,0.15)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                         style={{ animationDelay: '0.3s' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                  <div className="h-8 lg:h-12 w-48 lg:w-72 bg-gradient-to-r from-white/40 via-white/50 to-white/40 rounded-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(255,255,255,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                         style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                
             
                <div className="space-y-3 mb-8">
                  <div className="h-4 w-80 max-w-full bg-gradient-to-r from-white/30 to-white/40 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                         style={{ animationDelay: '0.7s' }} />
                  </div>
                  <div className="h-4 w-64 max-w-full bg-gradient-to-r from-white/30 to-white/40 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                         style={{ animationDelay: '0.9s' }} />
                  </div>
                  <div className="h-4 w-72 max-w-full bg-gradient-to-r from-white/30 to-white/40 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                         style={{ animationDelay: '1.1s' }} />
                  </div>
                </div>
               
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div className="h-12 w-40 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 rounded-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(99,102,241,0.4)] border border-white/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                         style={{ animationDelay: '1.3s' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                  <div className="h-12 w-40 bg-gradient-to-r from-white/20 to-white/30 backdrop-blur-sm rounded-2xl relative overflow-hidden border border-white/40 shadow-[0_8px_30px_rgba(255,255,255,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                         style={{ animationDelay: '1.5s' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  </div>
                </div>

             
                <div className="flex gap-6 mt-10 justify-center lg:justify-start">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center lg:items-start gap-2">
                      <div className="h-8 w-16 bg-gradient-to-r from-indigo-400/50 to-purple-400/50 rounded-xl relative overflow-hidden shadow-[0_4px_20px_rgba(99,102,241,0.2)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                             style={{ animationDelay: `${1.7 + i * 0.2}s` }} />
                      </div>
                      <div className="h-3 w-12 bg-white/30 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                             style={{ animationDelay: `${1.9 + i * 0.2}s` }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/60 via-purple-500/60 to-pink-500/60" />

          </div>
        </div>
      </div>


    </div>
  )
}

export default HeroSkeleton