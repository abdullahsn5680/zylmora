"use client";
import React from "react";

function NavbarSkeleton() {
  return (
    <div className="relative w-full">
      <nav className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 w-full relative z-20 flex flex-row lg:flex-row justify-between items-center px-3 sm:px-6 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border-b border-indigo-500/20 backdrop-blur-sm overflow-x-auto">
        
        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto min-w-max">
          
        
          <ul className="flex gap-2 sm:gap-3 lg:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="h-5 sm:h-6 w-14 sm:w-20 bg-gradient-to-r from-slate-800/80 via-slate-700/90 to-slate-800/80 rounded-xl flex-shrink-0 relative overflow-hidden shadow-[0_0_20px_rgba(100,116,139,0.15)]"
                style={{ 
                  animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  animationDelay: `${i * 0.3}s` 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                     style={{ animationDelay: `${i * 0.2}s` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              </li>
            ))}
          </ul>

     
          <div className="h-6 sm:h-8 w-24 sm:w-40 bg-gradient-to-r from-indigo-700/70 via-purple-600/80 to-indigo-700/70 rounded-xl flex-shrink-0 relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.4)] animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-400/30 to-indigo-500/0 blur-sm animate-[shimmer_3s_ease-in-out_infinite]" />
          </div>

       
          <div className="flex items-center bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md rounded-xl px-3 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(99,102,241,0.1)] border border-indigo-500/30 w-32 sm:w-48 flex-shrink-0 relative overflow-hidden">
            <div className="h-3 sm:h-4 w-3 sm:w-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mr-2 flex-shrink-0 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            <div className="h-3 sm:h-4 w-full bg-gradient-to-r from-slate-600/80 to-slate-700/80 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" 
                   style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          </div>

     
          <ul className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="h-6 sm:h-7 w-6 sm:w-7 bg-gradient-to-br from-slate-700/90 via-slate-600/90 to-slate-800/90 rounded-xl flex-shrink-0 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-slate-600/40"
                style={{ 
                  animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  animationDelay: `${0.8 + i * 0.3}s` 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                     style={{ animationDelay: `${0.7 + i * 0.2}s` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
              </li>
            ))}
          </ul>
        </div>
      </nav>

    
      <div className="announcement w-full shadow-lg relative overflow-hidden">
        <div className="h-7 sm:h-9 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 relative overflow-hidden border-b border-indigo-500/10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/15 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/60 to-purple-500/60 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-2">
              <div className="h-3 w-3 bg-indigo-500/40 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
              <div className="h-3 w-32 sm:w-48 bg-gradient-to-r from-slate-700/60 via-slate-600/60 to-slate-700/60 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                     style={{ animationDelay: '0.8s' }} />
              </div>
              <div className="h-3 w-24 bg-gradient-to-r from-slate-700/60 to-slate-800/60 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" 
                     style={{ animationDelay: '1.2s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

  
    </div>
  );
}

export default NavbarSkeleton;