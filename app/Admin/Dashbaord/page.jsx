'use client'
import { useContext,useEffect } from 'react'
import { UserContext } from '@/app/Context/contextProvider'
import { useRouter } from 'next/navigation'
function page() {
   const router =useRouter()
    const  {session}=useContext(UserContext)
  const isAdmin = session?.user?.role 
   useEffect(()=>{
      if(!session){
        router.replace('/Authentication')
      }
       if(!isAdmin){
        router.replace('/')
      }
    },[])
  return (
    <div className='w-full h-full justify-center items-center'> 
    Dashbaord is not created yet,
    </div>
  )
}

export default page