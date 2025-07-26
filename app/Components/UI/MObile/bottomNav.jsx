'use client';
import { Home, ShoppingBag, User, Menu, MapPinHouse, Group } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Link from 'next/link';

export default function BottomNavbar() {
    const router =useRouter();
      useEffect(() => {
            router.prefetch('/');
            router.prefetch('/Profile');
            router.prefetch('/Profile/Cart');
            router.prefetch('/Catagories');
            router.prefetch('/Profile/Orders');
          }, []);
  return (
 <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
  
  <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50"></div>
  
  <div className="absolute inset-0 bg-gradient-to-t from-white/95 to-white/80"></div>
  
  <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-black/10 to-transparent"></div>
  
  
  <div className="relative flex justify-around items-center h-20 px-2">
  
    <Link 
      href="/" 
      className="nav-item group relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 active:scale-95"
    >
    
      <div className="relative mb-1 p-2 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-200/30 group-hover:from-blue-100/80 group-hover:to-blue-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
        <Home 
          size={22} 
          className="text-slate-600 group-hover:text-blue-600 transition-colors duration-300" 
        />
        
        
      </div>
      
     
      <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-all duration-300 group-hover:font-semibold">
        Home
      </span>
      
      
    </Link>

    <Link 
      href="/Profile/Orders" 
      className="nav-item group relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 active:scale-95"
    >
      <div className="relative mb-1 p-2 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-200/30 group-hover:from-emerald-100/80 group-hover:to-emerald-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
        <ShoppingBag 
          size={22} 
          className="text-slate-600 group-hover:text-emerald-600 transition-colors duration-300" 
        />
        
      
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
          <span className="text-white text-xs font-bold">3</span>
        </div>
      </div>
      
      <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-600 transition-all duration-300 group-hover:font-semibold">
        Orders
      </span>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full group-hover:w-8 transition-all duration-300"></div>
    </Link>

    
    <Link 
      href="/Catagories" 
      className="nav-item group relative flex flex-col items-center justify-center min-w-[70px] py-2 px-4 rounded-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-50/80 hover:to-pink-50/80 active:scale-95"
    >
      <div className="relative mb-1 p-3 rounded-2xl bg-gradient-to-br from-purple-100/80 to-pink-100/80 group-hover:from-purple-200/90 group-hover:to-pink-200/90 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl shadow-lg">
        <Group 
          size={24} 
          className="text-purple-600 group-hover:text-purple-700 transition-colors duration-300" 
        />
        
        
        <div className="absolute -top-1 -right-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping">
          <span className="text-purple-400 text-xs">✨</span>
        </div>
      </div>
      
      <span className="text-xs font-medium text-slate-700 group-hover:text-purple-600 transition-all duration-300 group-hover:font-bold">
        Categories
      </span>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:w-10 transition-all duration-300"></div>
    </Link>

    
    <Link 
      href="/Profile/Cart" 
      className="nav-item group relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 active:scale-95"
    >
      <div className="relative mb-1 p-2 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-200/30 group-hover:from-orange-100/80 group-hover:to-orange-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
        <User 
          size={22} 
          className="text-slate-600 group-hover:text-orange-600 transition-colors duration-300" 
        />
        
     
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 animate-bounce">
          <span className="text-white text-xs font-bold">2</span>
        </div>
      </div>
      
      <span className="text-xs font-medium text-slate-700 group-hover:text-orange-600 transition-all duration-300 group-hover:font-semibold">
        Cart
      </span>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full group-hover:w-8 transition-all duration-300"></div>
    </Link>

   
    <Link 
      href="/Profile/Address" 
      className="nav-item group relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 active:scale-95"
    >
      <div className="relative mb-1 p-2 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-200/30 group-hover:from-indigo-100/80 group-hover:to-indigo-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
        <MapPinHouse 
          size={22} 
          className="text-slate-600 group-hover:text-indigo-600 transition-colors duration-300" 
        />
        
       
       
      </div>
      
      <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-600 transition-all duration-300 group-hover:font-semibold">
        Address
      </span>
      
      
    </Link>
  </div>

</nav>
  );
}
