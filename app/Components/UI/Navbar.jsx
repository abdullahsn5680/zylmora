'use client';
import { Heart, Package, Search, ShoppingBag, User2,Ban,X } from 'lucide-react';
import Link from 'next/link';

import React, { useState, useRef, useContext,useEffect, } from 'react';
import { useRouter } from 'next/navigation';
import { CollectionContext, FilterContext, QueryContext } from '@/app/Context/contextProvider';
import Announcemnt from '../alerts/announcemnt';
import { BoxIcon } from 'lucide-react';
import { Box } from 'lucide-react';
import { BoxSelectIcon } from 'lucide-react';
import { closeFullscreen, openFullscreen } from '@/lib/provideFullScreen';
import { BookX } from 'lucide-react';
import { FullscreenIcon } from 'lucide-react';

function Navbar() {
  const [categories] = useContext(CollectionContext);
  const [confirmCatagory,setCofrimCategory]=useState('');
  const [query, setQuery] = useContext(QueryContext);
  const [fullScreen,setFullScreen]=useState(false)
  const [q,setQ]=useContext(QueryContext);
  const [hovered, setHovered] = useState(null);
  const timeoutRef = useRef(null);
  const router = useRouter();
  const [sq,setSq]=useState('');
    const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedSizes,
    selectedMinPrice,
    selectedHighPrice,
    selectedSortBy,
  } = useContext(FilterContext);
   const KeyDown=(e)=>{
    if(e.key=='Enter'){
     const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedSubCategory) queryParams.set('subcategory', selectedSubCategory);
     if (sq) queryParams.set('q', sq);
   const query = queryParams.toString()
    router.push(`/Collections?${query}`);
    }
   }
useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
     const Q = params.get('q');
  setSq(Q)
},[])
  const handleMouseEnter = (id) => {
    clearTimeout(timeoutRef.current);
    setHovered(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(null);
    }, 500);
  };

  const performAction = (confirmCatagory,sub) => {
    const queryParams = new URLSearchParams();
    if (confirmCatagory) queryParams.set('category', confirmCatagory);
    if (sub) queryParams.set('subcategory', sub);
    setQ('')
    setSq()
   const query = queryParams.toString()
    window.history.replaceState(null, '', `?${query}`);
    router.push(`/Collections?${query}`);
  };
 
 const handleRemove=() => {
  const queryParams = new URLSearchParams()
  setQ('');
  setSq('')
    if(selectedCategory) queryParams.set('category',selectedCategory);
     if(selectedSubCategory) queryParams.set('subcategory',selectedSubCategory);
      if(selectedSizes.length) queryParams.set('size',selectedSizes);
       if(selectedMinPrice) queryParams.set('minPrice',selectedMinPrice);
        if(selectedHighPrice) queryParams.set('highPrice',selectedHighPrice);
        if(selectedSortBy) queryParams.set('sortBy',selectedSortBy);
     
  const queryStr = queryParams.toString();

  setQuery(queryStr);
  window.history.replaceState(null, '', `?${queryStr}`);
}

  return (
  <div className=''>
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 transition-all duration-300 w-full relative z-20 flex justify-between items-center font-bold px-6 py-4 shadow-2xl border-b border-slate-700">
    
      <div className="options w-full">
        <ul className="flex gap-8">
          {categories.map((category) => (
            <li
              key={category._id}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(category._id)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                onMouseEnter={() => { setCofrimCategory(category.name) }}
                className="cursor-pointer text-sm px-4 py-2 hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden"
              >
                {category.name}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-slate-300 to-white transition-all duration-300"></div>
              </div>

              {hovered === category._id && (
                <div
                  className="absolute top-full left-0 flex flex-col bg-white text-slate-800 text-sm font-medium mt-2 w-40 rounded-xl shadow-2xl z-20 p-3 border border-slate-200 backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                  onMouseEnter={() => { handleMouseEnter(category._id) }}
                >
                  {category.subs?.map((sub, index) => (
                    <div
                      key={index}
                      onClick={() => {
                       
                        performAction(confirmCatagory,sub); 
                      }}
                      className="hover:bg-slate-100 hover:text-slate-900 p-2 w-full rounded-md transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-sm"
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

  
      <div className="brandNam cursor-pointer w-full text-center text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent hover:scale-105 transition-all duration-300">
        <Link href="/">ZYLMORA✦STORE</Link>
      </div>
    
      <div className="buttonsc w-full flex justify-end items-center gap-6">
        <ul className="flex gap-6">
             <li className="hover:text-slate-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-700">
            
              {!fullScreen?<FullscreenIcon onClick={()=>{ openFullscreen() ;setFullScreen(!fullScreen)}} className="w-5 h-5" />
                 :<BoxSelectIcon onClick={()=>{closeFullscreen();setFullScreen(!fullScreen)}} className="w-5 h-5" />
        }
          </li>
          <li className="hover:text-slate-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-700">
            <Link href="/Profile">
              <User2 className="w-5 h-5" />
            </Link>
          </li>
          <li className="hover:text-slate-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-700">
            <Link href="/Profile/Orders">
              <Package className="w-5 h-5" />
            </Link>
          </li>
          <li className="hover:text-slate-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-700">
            <Link href="/Profile/Cart">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </li>
        </ul>
    <div className="searchbar flex items-center bg-white text-slate-800 rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200">
  <Search className="w-4 h-4 text-slate-600" />
  <input

    onKeyDown={(e) => KeyDown(e)}
    type="text"
    value={sq||''}
    onChange={(e) => setSq(e.target.value)}
    placeholder="Search products..."
    className="bg-transparent outline-none px-3 text-sm placeholder-slate-500 w-40 flex-1"
  />
  
  
  {sq && (
    <>
      <div className="w-px h-6 bg-slate-300/60" role="separator"></div>
      <button
        onClick={() => handleRemove()}
        className="ml-2 p-1 rounded-full hover:bg-slate-100 transition-colors duration-200 group"
        aria-label="Clear search"
        type="button"
      >
        <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
      </button>
    </>
  )}
</div>
      </div>
       
    </nav>
    <div className="announcement w-full shadow-sm"><Announcemnt/></div>
    </div>
  );
}
export default Navbar;
