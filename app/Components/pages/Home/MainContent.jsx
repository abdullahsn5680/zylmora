import { Star } from 'lucide-react'
import React from 'react'
import CardContainer from '../../UI/Container/CardContainer'

function MainContent({content}) {
  return (
 
          <div className="containers w-full  px-2 md:px-8 lg:px-16 xl:px-20 py-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3  bg-white/70 backdrop-blur-sm rounded-2xl mb-6 border border-gray-200/60">
            <Star className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-600">Featured Collections</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-800 tracking-tight">
            Premium Fashion
          </h2>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6" />
          
          <p className="text-sm max-w-3xl mx-auto leading-relaxed text-gray-600">
            Explore our handpicked collections of premium fashion items, crafted with attention to detail and designed for the modern lifestyle.
          </p>
        </div>

        <div className="space-y-20">
          {content?.Items?.map((data, index) => (
            <div
              key={data.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: 'both'
              }}
            >
              <CardContainer prop={data} />
            </div>
          ))}
        </div>
</div>
     
     
   
  )
}

export default MainContent
