'use client'
import React from 'react'
import Card from '../Card/Card'
import { useRouter } from 'next/navigation'

function CardContainer({prop}) {
  const router = useRouter();
  const perfromAction = (url) => {
    router.push(url)
  }
  
  return (
    <div className='w-full bg-transparent mb-16'>
      <div className="info min-h-[160px] md:min-h-[200px] flex flex-col justify-center gap-4 items-center">
        <div className="name w-full text-center font-bold text-2xl md:text-3xl text-slate-800 tracking-tight">
          {prop.heading}
        </div>
        <div 
          onClick={() => {perfromAction(prop?.url)}} 
          className="group inline-flex items-center gap-2 mx-auto cursor-pointer bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl hover:bg-slate-100 transition-all duration-300 border border-gray-200 text-slate-700 hover:text-slate-900"
        >
          <span className="text-sm font-medium">View All</span>
          <span className="text-slate-400 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
      
      <div className="items w-full grid mx-auto lg:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center gap-4 md:gap-6">
        {prop.products.map((data) => (
          <Card key={data._id} prop={data}/>
        ))}
      </div>
      
      <div className="separator w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-16 rounded-full shadow-sm"></div>
    </div>
  )
}

export default CardContainer