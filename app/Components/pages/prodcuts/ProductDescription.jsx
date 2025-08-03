import React from 'react'

function ProdcutDescription(prop) {
    console.log(prop)
    const description = prop;
  return (
 
<div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
          <div className="mb-8 flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div>
            <h3 className="text-xl flex gap-2 items-center lg:text-3xl font-bold text-slate-800 mb-2 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="#4CAF50">
  <path d="M34 2H14a4 4 0 00-4 4v36a4 4 0 004 4h20a4 4 0 004-4V6a4 4 0 00-4-4zm-6 34H14v-4h14v4zm6-8H14v-4h20v4zm0-8H14v-4h20v4z"/>
</svg>
 Product Description</h3>
            <p className="text-sm lg:text-base text-slate-600">
              See all information about products
            </p>
          </div>
       
        </div>

    
        <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:p-6 transition-all hover:shadow-lg">
          {(description?.product ||[]).map((data) => (
            <div className="text-slate-700 leading-relaxed transition-all" key={data.id}>
              {data.id === 1 ? (
                <p className="text-lg lg:text-xl font-bold mb-6 text-slate-800 pb-3 border-b border-slate-100">{data.line}</p>
              ) : (
                <p className="mb-3 flex items-start gap-3 hover:bg-slate-50 rounded-md p-2 transition-colors duration-300">
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