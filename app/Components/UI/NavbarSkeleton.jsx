"use client";
import React from "react";

function NavbarSkeleton() {
  return (
    <div className="relative w-full animate-pulse">
      <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 w-full relative z-20 flex flex-row lg:flex-row justify-between items-center px-3 sm:px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border-b border-slate-700/50 backdrop-blur-sm overflow-x-auto">
        
      
        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto min-w-max">
          
         
          <ul className="flex gap-2 sm:gap-3 lg:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="h-5 sm:h-6 w-14 sm:w-20 bg-slate-700/50 rounded-lg flex-shrink-0"
              />
            ))}
          </ul>

         
          <div className="h-6 sm:h-8 w-24 sm:w-40 bg-slate-600 rounded-lg flex-shrink-0" />

          
          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200/20 w-32 sm:w-48 flex-shrink-0">
            <div className="h-3 sm:h-4 w-3 sm:w-4 bg-slate-500 rounded mr-2" />
            <div className="h-3 sm:h-4 w-full bg-slate-400/50 rounded" />
          </div>

         
          <ul className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="h-6 sm:h-7 w-6 sm:w-7 bg-slate-700/50 rounded-lg flex-shrink-0"
              />
            ))}
          </ul>
        </div>
      </nav>

     
      <div className="announcement w-full shadow-sm">
        <div className="h-7 sm:h-9 bg-slate-700/40" />
      </div>
    </div>
  );
}

export default NavbarSkeleton;
