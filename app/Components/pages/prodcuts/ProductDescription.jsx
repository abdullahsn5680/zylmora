import React from 'react'
import { Package, Sparkles } from 'lucide-react'

function ProductDescription(props) {
  const description = props;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
     
        <div className="mb-10 group">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]"></div>
            </div>
            
            <div className="relative z-1 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Package className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                    Product Description
                  </h3>
                </div>
                <p className="text-base lg:text-lg text-white/90 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Comprehensive product information at a glance
                </p>
              </div>
            </div>
            
          
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl"></div>
          </div>
        </div>

     
        <div className="relative group">
          
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700"></div>
          
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
          
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="p-6 lg:p-10">
              {(description?.product || []).map((data, index) => (
                <div 
                  key={data.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {data.id === 1 ? (
                    <div className="mb-8 pb-6 border-b-2 border-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                      <h2 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                        {data.line}
                      </h2>
                    </div>
                  ) : (
                    <div className="group/item mb-4 transform hover:translate-x-2 transition-all duration-300">
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50/50 hover:via-purple-50/30 hover:to-pink-50/20 transition-all duration-300">
                       
                        <div className="flex-shrink-0 mt-1.5">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 group-hover/item:scale-150 group-hover/item:shadow-lg group-hover/item:shadow-purple-300/50 transition-all duration-300"></div>
                        </div>
                        
                       
                        <p className="text-base lg:text-lg text-slate-700 leading-relaxed group-hover/item:text-slate-900 transition-colors duration-300 flex-1">
                          {data.line}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
            
              {(!description?.product || description.product.length === 0) && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                    <Package className="w-10 h-10 text-indigo-600" />
                  </div>
                  <p className="text-slate-500 text-lg">No product information available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      

    </div>
  )
}

export default ProductDescription