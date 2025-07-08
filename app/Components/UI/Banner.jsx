'use client'
import React from 'react'
import Image from 'next/image'
function Banner({url}) {
  return (
    <div className='w-full h-full '>
      <Image src={url} width={1280} className='w-full' height={720}  alt='banner'/>
    </div>
  )
}

export default Banner
