import { ArrowRight } from 'lucide-react'
import { Eye } from 'lucide-react'
import React from 'react'

function Orders_Catagories({statusCategories,setSelectedStatus}) {
  return (
    <div>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 tracking-tight">
                Browse by Status
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
            </div>

           
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8">
              {statusCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedStatus(category.name)}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-200/60"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                 
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-50`} />
                  
               
                  <div className="relative p-3 md:p-12">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        {category.icon}
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-5xl font-black bg-gradient-to-br ${category.gradient} bg-clip-text text-transparent`}>
                          {category.count}
                        </div>
                        <div className="text-sm text-gray-500 font-semibold">Orders</div>
                      </div>
                    </div>

               <h3
  className="text-2xl md:text-3xl font-black text-gray-800 mb-3 
             group-hover:text-blue-600 transition-colors duration-300
             truncate"
>
  {category.name}
</h3>
                    
                    <div className="text-gray-600  mb-6 leading-relaxed">
                      <span className='text-xs hidden md:flex md:text-xl'> View and manage all {category.name.toLowerCase()} orders in one place</span>
                     
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="group/btn hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300">
                        View Orders
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>

                
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${category.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-3xl`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl" />
                  
               
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                    <Eye className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              ))}
            </div>
        
    </div>
  )
}

export default Orders_Catagories
