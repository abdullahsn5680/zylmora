'use client';
import { Home, ShoppingBag, User, Menu, MapPinHouse } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Link from 'next/link';

export default function BottomNavbar() {
    const router =useRouter();
      useEffect(() => {
            router.prefetch('/');
            router.prefetch('/Profile');
            router.prefetch('/Profile/Cart');
            router.prefetch('/Profile/Orders');
          }, []);
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50 md:hidden">
      <div className="flex justify-around items-center h-14">
        <Link href="/" className="flex flex-col items-center text-sm text-gray-700 hover:text-red-600">
          <Home size={20} />
          Home
        </Link>
        <Link href="/Profile/Orders" className="flex flex-col items-center text-sm text-gray-700 hover:text-red-600">
          <ShoppingBag size={20} />
          Orders
        </Link>
        <Link href="/Profile/Cart" className="flex flex-col items-center text-sm text-gray-700 hover:text-red-600">
          <User size={20} />
         Cart
        </Link>
        <Link href="/Profile/Address" className="flex flex-col items-center text-sm text-gray-700 hover:text-red-600">
          <MapPinHouse size={20} />
        Address
        </Link>
       
      </div>
    </nav>
  );
}
