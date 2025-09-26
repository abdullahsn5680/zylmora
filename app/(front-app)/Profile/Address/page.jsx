import React from 'react'
import AddressManager from './ClientAddress'
import { AddressProvider } from '@/app/Provider/Address/AddressProvider'
function page() {
  return (
    <AddressProvider>
      <AddressManager/>
    </AddressProvider>
  )
}

export default page
