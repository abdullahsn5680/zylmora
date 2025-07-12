'use client';
import React, { useState,useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/app/Components/Loader/loader';
import { UserContext } from '@/app/Context/contextProvider';
export default function WishlistPage() {
  const router = useRouter();
 const { session } = useContext(UserContext)
   const [loading,setLoading]=useState(true)
  const [wishlist, setWishlist] = useState([
    
  ]);
useEffect(()=>{
    if(!session){
      router.replace('/Authentication')
    }
    
  },[])
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };
 useEffect(() => {
    const getProduct =async () => {
   
      try {
        if(session?.user?.email){
       const res = await fetch(`/api/Wishlist?email=${session.user.email}`);
const data = await res.json();

if (data) {
  setWishlist(data);
console.log(data)
  setTimeout(() => {
    setLoading(false);
  }, 500); 
}

}   
       ;
      } catch (err) {
        console.error(err);
      }
    } 
    getProduct()
  }, [session?.user?.email]);


if(loading) return <Loader/>
  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
      
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
          >
            ← Back
          </button>
        </div>

       
        <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist?.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <h2 className="text-base md:text-lg font-semibold mt-3 line-clamp-2">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {item.category} • {item.subcategory}
                </p>

                <p className="text-sm text-gray-500">Brand: {item.vendor}</p>

                <div className="mt-2">
                  <span className="line-through text-gray-400 text-sm mr-2">
                    Rs.{item.cut_price}
                  </span>
                  <span className="text-red-600 font-semibold">
                    Rs.{item.price}
                  </span>
                </div>

                <div className="mt-4 flex justify-between gap-2">
                  <button className="flex-1 text-sm bg-black text-white px-4 py-2 rounded hover:opacity-90">
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
