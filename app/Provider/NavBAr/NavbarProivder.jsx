'use client'
import NavbarM from '@/app/Components/UI/MObile/NavbarM'
import Navbar from '@/app/Components/UI/Navbar'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { useLenis } from '../Lenis/LenisProvider'
import NavbarSkeleton from '@/app/Components/UI/NavbarSkeleton'
import { CollectionContext } from '@/app/Context/contextProvider'


function NavbarProvider() {
   const [categories] = useContext(CollectionContext);
  const [hidden, setHidden] = useState(false)
  // const { scrollY, scrollDirection } = useLenis()

  // useEffect(() => {
  //   if (scrollDirection == 'down' ) {
  //     setHidden(true)
  //   } else if (scrollDirection == 'up') {
  //     setHidden(false)
  //   }
  // }, [ scrollDirection])
console.log(categories)
if(categories.length<1) return <div
      className={`fixed top-0 left-0 right-0 z-10 transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
    
 <NavbarSkeleton/>

    </div>

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10 transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
       <Suspense fallback={<div><NavbarSkeleton/></div>}>
    
 
      <div className="flex lg:hidden">
       <NavbarM/>
      </div>
      <div className="hidden w-full lg:flex">
        <Navbar/>
      </div>
         </Suspense>
    </div>
  )
}

export default NavbarProvider
