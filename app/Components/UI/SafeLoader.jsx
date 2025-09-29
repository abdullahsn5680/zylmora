'use client'
import { LoaderContext } from '@/app/Context/contextProvider'
import React, { useContext, useEffect } from 'react'
import Loader from '../Loader/loader'

function SafeLoader({ children }) {
  const [loading] = useContext(LoaderContext)

  useEffect(() => {
    console.log("SafeLoader loading state:", loading)
  }, [loading])

  if (loading) {
    return <Loader />
  }

  // must return children when not loading
  return children
}

export default SafeLoader
