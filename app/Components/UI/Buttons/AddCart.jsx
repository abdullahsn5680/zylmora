'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
function AddCart({prop}) {
  const router = useRouter();
  const performAction = (url) => {

       const query = new URLSearchParams({
      url:url,
      
    }).toString();
        const path =`/products?${query}`
    router.push(path)
   
  }
  
  return (
    <div className='w-full'>
      <button onClick={()=>performAction(prop._id)} type="button" className="text-gray-900 hover:text-white  border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-extrabold border-2 rounded-lg text-sm py-1 px-2 md:px-5 md:py-2.5 text-center w-full ">Quick Add</button>
    </div>
  )
}

export default AddCart
