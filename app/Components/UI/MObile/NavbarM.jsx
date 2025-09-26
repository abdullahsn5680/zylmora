'use client'
import React, { useEffect, useState, useContext } from 'react';
import { AlignJustify, SearchCheck, Heart, Search, ShoppingBag, User2,X } from 'lucide-react';
import Announcemnt from '../../alerts/announcemnt';
import { SlideBarContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';
import { FullscreenIcon } from 'lucide-react';
import { closeFullscreen, openFullscreen } from '@/lib/provideFullScreen';
import { BoxSelectIcon } from 'lucide-react';
function NavbarM() {
  const [isSlide, setIsSlide] = useContext(SlideBarContext);
   const [fullScreen,setFullScreen]=useState(false)
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
    <div className='bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 w-full shadow-2xl border-b border-slate-700'>
      <ul className='flex w-full text-slate-100 justify-around items-center h-[9vh] px-2'>
        <li className='cursor-pointer hover:text-slate-300 transition-all duration-300 hover:scale-110 p-3 rounded-xl hover:bg-slate-700 hover:shadow-lg' onClick={slide}>
          <AlignJustify className="w-5 h-5 text-slate-100" />
        </li>
       <li onClick={()=>{performanSearch()}}> <SearchCheck className="w-5 h-5 text-slate-100" /></li>
        <li className="brandName text-center text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent hover:scale-105 transition-all duration-300 cursor-pointer px-4 py-2 rounded-lg" onClick={()=>router.push('/')}>
          ✦ZYLMORA✦
        </li>
        {!fullScreen?<FullscreenIcon onClick={()=>{ openFullscreen() ;setFullScreen(!fullScreen)}} className="w-5 h-5" />
                         :<BoxSelectIcon onClick={()=>{closeFullscreen();setFullScreen(!fullScreen)}} className="w-5 h-5" />
                }
        <li className='cursor-pointer hover:text-slate-300 transition-all duration-300 hover:scale-110 p-3 rounded-xl hover:bg-slate-700 hover:shadow-lg' onClick={()=>router.push('/Profile')}>
          <User2 className="w-5 h-5 text-slate-100" />
        </li>
        <li className='cursor-pointer hover:text-slate-300 transition-all duration-300 hover:scale-110 p-3 rounded-xl hover:bg-slate-700 hover:shadow-lg' onClick={()=>router.push('/Profile/Cart')}>
          <ShoppingBag className="w-5 h-5 text-slate-100" />
        </li>
      </ul>
       <div className="announcement w-full shadow-sm"><Announcemnt/></div>
    </div>
  );
}

export default NavbarM;
