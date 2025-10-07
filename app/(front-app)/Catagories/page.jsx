import React from 'react'
import CategoriesClient from './CategoriesClient'
import { isrFetch } from '@/Utils/isrFetch'
export const revalidate = 36000;
async function page() {
  const data = await isrFetch('/api/catagories', 36000)
  const categoriesData = data.categories
  return (
   <CategoriesClient categoriesData={categoriesData}/>
  )
}

export default page
