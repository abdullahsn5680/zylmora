'use client';
import {  signOut } from 'next-auth/react';
import { useEffect, useState,useContext } from 'react';

import { UserContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';
import { LoaderContext } from '@/app/Context/contextProvider';
import {
  User,
  Package,
  Heart,
  LogOut,
  ShoppingBag,
  Shield,
  PlusCircle,
  Layers3,
  Edit,
  LuggageIcon,
  HomeIcon,
} from 'lucide-react';

export default function ProfilePage() {
  const  {session,status}=useContext(UserContext)
   const [loader,setLoading]=useContext(LoaderContext)
  const router = useRouter();
useEffect(()=>{
    if(status !== "loading"){
     if(!session) router.replace('/Authentication')
    }
    
  },[status])
    

const isAdmin = session?.user?.role === true;
 useEffect(()=>{
    if(!session){
      router.push('/Authentication')
    }
    
  },[])
  useEffect(() => {
       
  
    router.prefetch('/Profile/Account');
    router.prefetch('/Profile/Orders');
    router.prefetch('/Profile/Wishlist');
    router.prefetch('/Profile/Cart');
    router.prefetch('/Profile/Address');
    router.prefetch('/Profile/Orders');
    router.prefetch('/Profile/Orders');
   
  }, []);
   useEffect(() => {
       if(isAdmin){
  
    router.prefetch('/Admin/AddProducts');
    router.prefetch('/Admin/Collections');
    router.prefetch('/Admin/Order');
    router.prefetch('/Admin/Products');
     router.prefetch('/Admin/UpdateProduct');

       }
  }, []);
const menuOptions = [
  {
    label: 'Manage My Account',
    icon: <User size={18} />,
    path: '/Profile/Account',
  },
  {
    label: 'My Orders',
    icon: <Package size={18} />,
    path: '/Profile/Orders',
  },
  {
    label: 'My Wishlist',
    icon: <Heart size={18} />,
    path: '/Profile/Wishlist',
  },
  {
    label: 'My Cart',
    icon: <ShoppingBag size={18} />,
    path: '/Profile/Cart',
  },
  {
    label: 'Address Book',
    icon: <LogOut size={18} />,
    path: '/Profile/Address',
  },
  ...(isAdmin ? [
  
    {
      label: 'Add Products',
      icon: <Package size={18} />,
      path: '/Admin/AddProducts',
    },
    {
      label: 'Admin Collections',
      icon: <Heart size={18} />,
      path: '/Admin/Collections',
    },
     {
      label: 'Home Page',
      icon: <HomeIcon size={18} />,
      path: '/Admin',
    },
    {
      label: 'All Orders',
      icon: <ShoppingBag size={18} />,
      path: '/Admin/Order',
    },
   {
      label: 'All Products',
      icon: < LuggageIcon size ={18} />,
      path: '/Admin/Products',
    },
     
    
  ] : []),
  {
    label: 'Logout',
    icon: <LogOut size={18} />,
    path: '/Logout',
  },
];


  return (
<div className="min-h-screen bg-gradient-to-br pb-20 from-slate-50 via-gray-50 to-stone-50 px-4 py-10">
 
  <div className="max-w-3xl mx-auto text-center mb-8">
    <div className="inline-flex items-center gap-3 mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 rounded-full flex items-center justify-center shadow-md">
        <span className="text-xl sm:text-2xl text-white">👤</span>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
        My Profile
      </h1>
    </div>
    <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
      Quick access to your account settings and preferences
    </p>
  </div>

  <div className="max-w-2xl mx-auto space-y-4">
    {menuOptions.map((option, index) => (
      <div
        key={index}
        onClick={() => {
          if (option.path === '/Logout') {
            signOut();
          } else {
            router.push(option.path);
          }
        }}
        className="group flex items-center justify-between bg-white/70 backdrop-blur-md px-5 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 cursor-pointer border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 group-hover:bg-slate-300 transition">
            <span className="text-xl text-slate-700">{option.icon}</span>
          </div>
          <span className="text-base font-medium text-slate-700 group-hover:text-slate-900">
            {option.label}
          </span>
        </div>
        <span className="text-slate-400 group-hover:translate-x-1 transition-transform duration-300">
          →
        </span>
      </div>
    ))}
  </div>
</div>


  );
}
