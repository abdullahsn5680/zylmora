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
    <div className='w-full bg-slate-50 mb-16 p-2 md:p-4 lg:p-6'>
      <div className="info min-h-[160px] md:min-h-[200px] flex flex-col justify-center items-center gap-4 text-center">
        <div className="name w-full font-bold text-xl md:text-3xl text-slate-800 tracking-tight">
          {prop.heading}
        </div>

        <button
          onClick={() => {perfromAction(prop?.url)}}
          className="group relative inline-block cursor-pointer rounded-md p-px text-xs font-semibold leading-6 text-slate-800 transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800"
        >
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute inset-0 rounded-md bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(203,213,225,0.6)_0%,rgba(203,213,225,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative z-[1] flex items-center space-x-2 rounded-md bg-white px-4 py-1 ring-1 ring-slate-200 shadow-sm transition-colors duration-300 group-hover:bg-slate-800 group-hover:text-white">
            <span>View All</span>
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
          <span className="absolute -bottom-0 left-4 h-1 w-0 bg-gradient-to-r from-slate-300 to-slate-800 transition-all duration-500 group-hover:w-[calc(100%-2rem)]" />
        </button>
      </div>

      <div className="items w-full grid mx-auto gap-2 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-center items-center">
        {prop.products.map((data) => (
          <Card key={data._id} prop={data}/>
        ))}
      </div>

      <div className="separator w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-16 rounded-full shadow-sm"></div>
    </div>
  )
}

export default CardContainer
