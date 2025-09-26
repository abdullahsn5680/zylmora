import React from 'react'

function ProdcutDescription(prop) {
    
    const description = prop;
  return (
 <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
  

  <div className="mb-8 flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-slate-200/60 hover:shadow-xl transition-all duration-500">
    <div>
      <h3 className="text-xl lg:text-3xl font-bold text-slate-800 mb-2 flex gap-2 items-center tracking-tight">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className="drop-shadow-sm">
          <path fill="url(#grad)" d="M34 2H14a4 4 0 00-4 4v36a4 4 0 004 4h20a4 4 0 004-4V6a4 4 0 00-4-4zm-6 34H14v-4h14v4zm6-8H14v-4h20v4zm0-8H14v-4h20v4z"/>
          <defs>
            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        Product Description
      </h3>
      <p className="text-sm lg:text-base text-slate-600">
        See all information about products
      </p>
    </div>
  </div>

  <div className="max-w-4xl bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-200/60 p-4 lg:p-6 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500">
    {(description?.product || []).map((data) => (
      <div className="text-slate-700 leading-relaxed" key={data.id}>
        {data.id === 1 ? (
          <p className="text-lg lg:text-xl font-bold mb-6 text-slate-800 pb-3 border-b border-slate-200/70">
            {data.line}
          </p>
        ) : (
          <p className="mb-3 flex items-start gap-3 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 rounded-md p-2 transition-colors duration-300">
            <span className="text-slate-400 mt-1 text-sm">•</span>
            <span className="text-sm lg:text-base">{data.line}</span>
          </p>
        )}
      </div>
    ))}
  </div>
</div>

  )
}

export default ProdcutDescription