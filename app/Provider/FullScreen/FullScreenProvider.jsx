'use client'
import React, { useEffect, useState } from 'react'
import { useAlert } from '../Alert/AlertProvider'
import { openFullscreen } from '@/lib/provideFullScreen';
function FullScreenProvider({children}) {
    const {showAlert} = useAlert();
useEffect(()=>{
showAlert.confirm(
  'For the best and most immersive experience, we recommend switching to fullscreen mode. Would you like to enable fullscreen now?',
  () => { openFullscreen() },
  {
  title:'Enable Full Screen',
     confirmText: 'Full Screen',
    cancelText: 'Default',
    onCancel: () => { console.log('User cancelled fullscreen request') }
  }
)

},[])


  return (
   children
  )
}

export default FullScreenProvider
