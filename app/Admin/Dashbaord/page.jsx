'use client'
import { useContext,useEffect } from 'react'
import { UserContext } from '@/app/Context/contextProvider'
import { useRouter } from 'next/navigation'
function page() {
   const router =useRouter()
    const  {session,status}=useContext(UserContext)
  const isAdmin = session?.user?.role 
 useEffect(()=>{
  if(status !== "loading"){
    if(!session){
      router.replace('/Authentication')
    }
     if(!isAdmin){
      router.replace('/')
    }
}},[status])
  return (
    <div className='w-full h-full justify-center items-center'> 
    Dashbaord is not created yet,
    </div>
  )
}

export default page