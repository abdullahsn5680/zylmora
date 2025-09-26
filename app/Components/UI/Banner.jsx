'use client'
import React from 'react'
import Image from 'next/image'
function Banner({url}) {
  return (
    <div className='w-full h-full '>
      <Image src={url||'/banner/banner.webp'} width={2400} className='w-full' height={1200}  alt='banner'/>
    </div>
  )
}

export default Banner
