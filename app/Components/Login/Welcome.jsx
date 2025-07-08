'use client'
import React from 'react'
import { useContext } from 'react'
import { AuthAnimationContext } from '@/app/Context/contextProvider';
function Welcome() {
    const [authAnimation, setAuthAnimation] = useContext(AuthAnimationContext);

  return (
    <div className=' text-white  h-[455px]  w-[360px] flex justify-center items-center flex-col gap-3'>
      <div className='text text-center text-3xl font-bold'>Hellow,Welcome!</div>
      <div className='text-xs'>Don`t have an account</div>
      <button onClick={()=>{setAuthAnimation(!authAnimation)}} className="bg-transparent border  text-white rounded-md transition-all duration-200 hover:bg-[#f44336] hover:text-white text-[16px] px-[30px] font-semibold py-[10px] mt-2 ">
            Register
          </button>
    </div>
  )
}

export default Welcome
