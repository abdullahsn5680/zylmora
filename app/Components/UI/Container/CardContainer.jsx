'use client'
import React from 'react'
import Card from '../Card/Card'
import { useRouter } from 'next/navigation'
function CardContainer({prop}) {
 
  const router = useRouter();
  const perfromAction =(url)=>{
    router.push(url)
  }
  return (
    <div className='w-full bg-transparent '>
      <div className="info h-[130px] md:min-h-[200px]  flex flex-col justify-center gap-3 items-center
      "><div className="name w-full text-center font-extrabold  justi text-xl"  >{prop.heading}</div>
      <div onClick={()=>{perfromAction(prop?.url)}} className="rediector mx-auto cursor-pointer hover:text-slate-900 border border-transparent border-b-slate-800 text-sm text-slate-800 text-center">View All</div></div>
      
      <div className="items w-full grid mx-auto  lg:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center gap-4">
        {prop.products.map((data)=>(
          <Card key={data._id} prop={data}/>
        ))}
      </div>
      <div className="separator w-full h-[1px] bg-slate-100 mt-20 shadow shadow-slate-500 rounded-full"> </div>
    </div>
  )
}

export default CardContainer
