'use client'
import NavbarM from '@/app/Components/UI/MObile/NavbarM'
import Navbar from '@/app/Components/UI/Navbar'
import React, { Suspense, } from 'react'
import NavbarSkeleton from '@/app/Components/UI/NavbarSkeleton'


function NavbarClient({categories}) {


  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10 transition-transform duration-300 `}
    >
       <Suspense fallback={<div><NavbarSkeleton/></div>}>
    
 
      <div className="flex lg:hidden">
       <NavbarM/>
      </div>
      <div className="hidden w-full lg:flex">
        <Navbar categories={categories}/>
      </div>
         </Suspense>
    </div>
  )
}

export default NavbarClient
