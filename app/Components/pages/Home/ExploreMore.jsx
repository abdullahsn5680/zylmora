import { TrendingUp } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React from 'react'

function ExploreMore() {
      const router=useRouter()
  return (
    <div className="text-center w-full ">
          <div className="inline-block p-10 bg-white/70 w-full backdrop-blur-sm border border-gray-200/60 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-3xl font-black mb-4 text-gray-800">
              Ready to Explore More?
            </h3>
            
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Discover thousands of premium products across all categories and find your perfect style.
            </p>
            
            <button onClick={()=>router.push('./Catagories')} className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 overflow-hidden shadow-xl hover:shadow-2xl">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div   className="relative flex text-[0.9rem] items-center gap-2.5">
                <Sparkles className="w-6 h-6" />
                
                Browse All Collections
                <TrendingUp className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
  )
}

export default ExploreMore
