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
        <button onClick={() => {perfromAction(prop?.url)}}  className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
    
  <span className="absolute inset-0 overflow-hidden rounded-full">
    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  </span>
  <div className="relative flex transition-all duration-300 hover:translate-y-1/2 space-x-2 items-center z-1 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
    <span>
    View All
    </span>
    <svg
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.75 8.75L14.25 12L10.75 15.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  </div>
  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
</button>
        
        
        
       
      </div>
      
      <div className="items w-full grid mx-auto gap-2 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center  md:gap-6">
        {prop.products.map((data) => (
          <Card key={data._id} prop={data}/>
        ))}
      </div>
      
      <div className="separator w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-16 rounded-full shadow-sm"></div>
    </div>
  )
}

export default CardContainer