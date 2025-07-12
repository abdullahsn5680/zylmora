'use client'
import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AddCart from '../Buttons/AddCart';

function Card({ prop }) {
console.log(prop)

  return (
    <div className='flex flex-col gap-3 w-full max-w-xs md:max-w-sm lg:max-w-md transition-all hover:-translate-y-1 shadow-slate-500 duration-300 bg-[#ffffff] shadow border  border-slate-400 hover:shadow-2xl p-2 md:p-3 md:py-4 rounded-2xl'>
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <Image
          width={800}
          height={800}
          src={prop.main_image}
          alt='img'
          className='w-full h-full object-cover rounded-xl'
        />

        {prop.discount != 0 && (
          <div className='absolute top-0 left-0 flex flex-col text-xs md:text-sm'>
            <span className='bg-white text-black px-2 py-0.5'>New</span>
            <span className='text-white bg-red-700 px-2 py-0.5'>-{prop.discount}%</span>
          </div>
        )}

        <div className="absolute bottom-2 w-full px-[4px] md:px-2 flex justify-end gap-2">
          {prop.sizes.map((data) => (
            <div
              key={data._id}
              className='text-white font-bold bg-red-900 w-5 h-5  md:h-8 md:w-8  flex items-center justify-center rounded-full text-[10px] md:text-sm'>
              {data.size}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <AddCart prop={prop}  />
      </div>

      <div
       
        className="cursor-pointer w-full text-[11px]  md:text-base max-h-10 h-fit text-slate-800"
      >
        {prop.title}
      </div>

      <div className="price flex gap-2 text-[12px] md:text-base">
        {prop.discount != 0 && <span className='line-through'>RS{prop.price}</span>}
        <span className='text-[#e95144]'>Rs:{prop.cut_price}</span>
      </div>
    </div>
  )
}

export default Card;

