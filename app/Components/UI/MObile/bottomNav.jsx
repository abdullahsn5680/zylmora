'use client';
import { Home, ShoppingBag, User, Menu, MapPinHouse, Group } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BottomNavbar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('');

 

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    
    setTimeout(() => setActiveItem(''), 800);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50"></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 to-white/80"></div>
        
        <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-black/10 to-transparent"></div>
        
        
        <div className="relative flex justify-around items-center h-20 px-2">
        
          <Link 
            href="/" 
            className="nav-item group relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 active:scale-95"
            onClick={() => handleItemClick('home')}
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
            
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ${
              activeItem === 'home' ? 'w-12 animate-pulse' : 'w-0 group-hover:w-8'
            }`}></div>
          </Link>

          <Link 
            href="/Profile/Orders" 
            className="nav-item group relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 active:scale-95"
            onClick={() => handleItemClick('orders')}
          >
            <div className="relative mb-1 p-2 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-200/30 group-hover:from-emerald-100/80 group-hover:to-emerald-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <ShoppingBag 
                size={22} 
                className="text-slate-600 group-hover:text-emerald-600 transition-colors duration-300" 
              />
            </div>
            
            <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-600 transition-all duration-300 group-hover:font-semibold">
              Orders
            </span>
            
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ${
              activeItem === 'orders' ? 'w-12 animate-pulse' : 'w-0 group-hover:w-8'
            }`}></div>
          </Link>

          
          <Link 
            href="/Catagories" 
            className="nav-item group relative flex flex-col items-center justify-center min-w-[70px] py-2 px-4 rounded-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-50/80 hover:to-pink-50/80 active:scale-95"
            onClick={() => handleItemClick('categories')}
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
            
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500 ${
              activeItem === 'categories' ? 'w-14 animate-pulse' : 'w-0 group-hover:w-10'
            }`}></div>
          </Link>

          
          <Link 
            href="/Profile/Cart" 
            className="nav-item group relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 active:scale-95"
            onClick={() => handleItemClick('cart')}
          >
            <div className="relative mb-1 p-2 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-200/30 group-hover:from-orange-100/80 group-hover:to-orange-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <User 
                size={22} 
                className="text-slate-600 group-hover:text-orange-600 transition-colors duration-300" 
              />
            </div>
            
            <span className="text-xs font-medium text-slate-700 group-hover:text-orange-600 transition-all duration-300 group-hover:font-semibold">
              Cart
            </span>
            
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-500 ${
              activeItem === 'cart' ? 'w-12 animate-pulse' : 'w-0 group-hover:w-8'
            }`}></div>
          </Link>

         
          <Link 
            href="/Profile/Address" 
            className="nav-item group relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 active:scale-95"
            onClick={() => handleItemClick('address')}
          >
            <div className="relative mb-1 p-2 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-200/30 group-hover:from-indigo-100/80 group-hover:to-indigo-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <MapPinHouse 
                size={22} 
                className="text-slate-600 group-hover:text-indigo-600 transition-colors duration-300" 
              />
              
              
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
            </div>
            
            <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-600 transition-all duration-300 group-hover:font-semibold">
              Address
            </span>
            
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500 ${
              activeItem === 'address' ? 'w-12 animate-pulse' : 'w-0 group-hover:w-8'
            }`}></div>
          </Link>
        </div>
      </nav>
    </>
  );
}