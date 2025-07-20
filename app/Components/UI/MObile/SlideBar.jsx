'use client'
import React, { useEffect, useState, useContext } from 'react'
import { SlideBarContext } from '@/app/Context/contextProvider'
import { Search } from 'lucide-react'
import { CollectionContext } from '@/app/Context/contextProvider'
import { FilterContext } from '@/app/Context/contextProvider'
import { useRouter } from 'next/navigation'
function SlideBar() {
  const [categories] = useContext(CollectionContext)
  const [isSlide, setIsSlide] = useContext(SlideBarContext)
  const [left, setLeft] = useState('left-[-90vw]')
  const [active, setActive] = useState(0)
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
  useEffect(() => {
    if (isSlide !== 'false') {
      setLeft('left-[-10]')
    } else {
      setLeft('left-[-90vw]')
    }
  }, [isSlide])
 const performAction=()=>{
   const query = new URLSearchParams({
    category: selectedCategory,
    subcategory: selectedSubCategory,
  }).toString();
    router.push(`/Collections`)



 }
  return (
    <div className={`h-screen w-[80vw] absolute transition-all duration-300 top-[9vh] ${left} px-5 pt-2 bottom-0 bg-black`}>
      {isSlide === 'slide' && (
        <div className="search text-white flex flex-col gap-2">
          <div className="heading flex justify-between text-xl font-bold">
            <span>Menu</span>
            <span onClick={() => setIsSlide('false')}>X</span>
          </div>
          <div className="seerater w-full h-[1px] bg-slate-400 mb-4"></div>

          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => setActive(active === cat._id ? 0 : cat._id)}
              className="menu text-[20px] text-slate-300"
            >
              <div className="seerater w-full h-[1px] bg-slate-800"></div>
              <div onClick={()=>{setSelectedCategory(cat.name)}} className="flex justify-between p-1">
                <span>{cat.name}</span>
                <span>+</span>
              </div>
              <div className="seprater w-full h-[1px] bg-slate-800"></div>
              <ul className="items m-3 text-md">
                {active === cat._id &&
                  cat.subs?.map((sub, idx) => (
                    <li onClick={()=>{setSelectedSubCategory(sub);performAction();}}
                      key={`${cat._id}-${idx}`}
                      className="bg-gray-900 m-1 p-1 text-center rounded font-bold text-[15px]"
                    >
                      {sub}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {isSlide === 'search' && (
        <div className="search text-white flex flex-col gap-2">
          <div className="heading flex justify-between text-xl font-bold">
            <span>Search</span>
            <span onClick={() => setIsSlide('false')}>X</span>
          </div>
          <div className="seerater w-full h-[1px] bg-slate-400"></div>
          <div className="searchbox flex border mt-3 p-2 rounded-xl">
            <input
              placeholder="search"
              className="border-transparent outline-none w-full"
              type="text"
            />
            <span>
              <Search />
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SlideBar
