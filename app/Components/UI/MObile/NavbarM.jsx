'use client'
import React, { useEffect, useState, useContext } from 'react';
import { AlignJustify, SearchCheck, Heart, Search, ShoppingBag, User2 } from 'lucide-react';
import { SlideBarContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';
function NavbarM() {
  const [isSlide, setIsSlide] = useContext(SlideBarContext);
  const router=useRouter();
  const slide = () => {
    if (isSlide === 'search') {
      setIsSlide('false');
      setTimeout(() => {
        setIsSlide('slide');
      }, 500);
    } else {
     if(isSlide == 'false'){setIsSlide('slide');}else{
  setIsSlide('false');
}
    }
  };
      useEffect(() => {
        router.prefetch('/');
        router.prefetch('/Authentication');
        router.prefetch('/Profile/Wishlist');
        router.prefetch('/Profile/Cart');
        router.prefetch('/Collections');
      }, []);
    
  const performanSearch = () => {
    if (isSlide == 'slide') {
      setIsSlide('false');
      setTimeout(() => {
        setIsSlide('search');
      }, 500);
    } else {
if(isSlide == 'false'){setIsSlide('search');}else{
  setIsSlide('false');
}
      
    }
  };

  return (
    <div className='text-white bg-black w-full'>
      <ul className='flex w-full justify-around items-center h-[9vh]'>
        <li className='cursor-pointer hover:text-gray-500' onClick={slide}><AlignJustify /></li>
        <li className='cursor-pointer hover:text-gray-500' onClick={performanSearch}><SearchCheck /></li>
        <li className="brandName text-center text-[25px]">✦ZYLMORA✦</li>
        <li className='cursor-pointer hover:text-gray-500' onClick={()=>router.push('/Profile/Account')}><User2 /></li>
        <li className='cursor-pointer hover:text-gray-500' onClick={()=>router.push('/Profile/Cart')}><ShoppingBag /></li>
      </ul>
    </div>
  );
}

export default NavbarM;
