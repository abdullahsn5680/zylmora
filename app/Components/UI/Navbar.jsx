'use client'
import { Heart, Search, ShoppingBag, User2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useRef, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { CollectionContext } from '@/app/Context/contextProvider'
import { FilterContext } from '@/app/Context/contextProvider'
function Navbar() {
  const [categories] = useContext(CollectionContext)
  const [hovered, setHovered] = useState(null)
  const timeoutRef = useRef(null)
  const router =useRouter();
     const {
       selectedCategory,
              setSelectedCategory,
              selectedSubCategory,
              setSelectedSubCategory,
              selectedSizes,
              setSelectedSizes,
              selectedSortBy,
              setSelectedSortBy,
              selectedMinPrice,
              setSelectedMinPrice,
              selectedHighPrice,
              setSelectedHighPrice,
    } = useContext(FilterContext);
  const handleMouseEnter = (id) => {
    clearTimeout(timeoutRef.current)
    setHovered(id)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(null)
    }, 500)
  }
 const performAction=()=>{
   const query = new URLSearchParams({
    category: selectedCategory,
    subcategory: selectedSubCategory,
  }).toString();
    router.push(`/Collections?${query}`)



 }
  return (
    <nav className='bg-gray-950 text-slate-100 transition-all duration-300 w-full relative z-20 flex justify-between items-center font-extrabold px-4 py-2'>
      <div className="options w-full">
        <ul className='flex gap-10'>
          {categories.map((category) => (
            <li
              key={category._id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category._id)}
              onMouseLeave={handleMouseLeave}
            >
              <div  onMouseEnter={()=>{setSelectedCategory(category.name)}} className="cursor-pointer text-[14px] px-2 py-1 hover:bg-gray-900 rounded-sm">
                {category.name}
              </div>

              {hovered === category._id && (
                <div
                  className="absolute top-full left-0 flex flex-col bg-gray-900 text-slate-200 text-sm font-medium mt-4 w-[150px] rounded shadow-lg z-20 p-2"
                  onMouseEnter={() => handleMouseEnter(category._id)}
                >
                  {category.subs?.map((sub, index) => (
                    <div
                    onClick={()=>{setSelectedSubCategory(sub);performAction();}}
                      key={index}
                    
                      className="hover:underline p-1 w-fit"
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

      <div onClick={()=>{router.push('/')}} className="brandNam cursor-pointer w-full text-center text-[24px]">
        ZYLMORA✦STORE
      </div>

      <div className="buttonsc w-full flex justify-end items-center gap-4">
        <ul className='flex gap-5'>
          <li className='cursor-pointer hover:text-gray-500' onClick={()=>{router.push('/Authentication')}}><User2 /></li>
          <li className='cursor-pointer hover:text-gray-500'onClick={()=>{router.push('/Profile/Wishlist')}}><Heart /></li>
          <li className='cursor-pointer hover:text-gray-500'onClick={()=>{router.push('/Profile/Cart')}}><ShoppingBag /></li>
        </ul>
        <div className="searchbar flex items-center border rounded p-2">
          <Search />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none px-2"
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
