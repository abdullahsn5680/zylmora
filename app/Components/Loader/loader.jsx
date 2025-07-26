import React from 'react';

function Loader() {
  return (
    <div className="min-h-screen  border-0 border-transparent w-screen h-screen flex items-center justify-center">
      <div className="text-center rounded-3xl p-16 max-w-md">
      
        <div className="relative mb-8 flex justify-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-indigo-600"></div>
          <div className="absolute animate-pulse rounded-full h-20 w-20 border-4 border-transparent border-t-cyan-400 opacity-50"></div>
        </div>
        
    
        <div className="space-y-4">
          <h2 className="text-slate-800 text-2xl font-semibold">Loading</h2>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-slate-600 text-sm font-medium opacity-75">Please wait while we prepare everything for you</p>
        </div>
        
       
        <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;