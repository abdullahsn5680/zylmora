'use client';
import {  signOut } from 'next-auth/react';
import { useEffect, useState,useContext } from 'react';
import { UserContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';
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
  
  const router = useRouter();

    
const  {session}=useContext(UserContext)
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
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl flex justify-start mb-4">
        <button
          onClick={() => router.push('./')}
          className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl w-full max-w-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          My Profile
        </h2>

    <div className="space-y-3">
  {menuOptions.map((option, index) => (
    <button
      key={index}
      onClick={() => {
        if (option.path === '/Logout') {
          signOut();
        } else {
          router.push(option.path);
        }
      }}
      className="w-full flex items-center justify-between text-left px-4 py-3 border rounded-lg bg-gray-50 hover:bg-red-50 transition"
    >
      <div className="flex items-center gap-3 text-gray-700 font-medium">
        {option.icon}
        {option.label}
      </div>
      <span className="text-xs text-gray-400">→</span>
    </button>
  ))}
</div>

      </div>
    </div>
  );
}
