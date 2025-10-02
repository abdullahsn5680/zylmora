import React from 'react'
import { Truck } from 'lucide-react'

function Announcement() {
  return (
    <div className='w-screen bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md'>
      <div className='container mx-auto px-4 py-3 flex justify-center items-center gap-2'>
        <Truck className='w-5 h-5 animate-pulse' />
        <p className='font-semibold text-sm md:text-base tracking-wide'>
          Free Shipping on orders over ₨2,000
        </p>
      </div>
    </div>
  )
}

export default Announcement