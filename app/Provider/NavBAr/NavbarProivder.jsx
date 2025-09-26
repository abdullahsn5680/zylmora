'use client'
import NavbarM from '@/app/Components/UI/MObile/NavbarM'
import Navbar from '@/app/Components/UI/Navbar'
import React, { useEffect, useState } from 'react'
import { useLenis } from '../Lenis/LenisProvider'

function NavbarProvider() {
  const [hidden, setHidden] = useState(false)
  const { scrollY, scrollDirection } = useLenis()

  useEffect(() => {
    if (scrollDirection == 'down' ) {
      setHidden(true)
    } else if (scrollDirection == 'up') {
      setHidden(false)
    }
  }, [ scrollDirection])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10 transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex lg:hidden">
        <NavbarM />
      </div>
      <div className="hidden lg:flex">
        <Navbar />
      </div>
    </div>
  )
}

export default NavbarProvider
