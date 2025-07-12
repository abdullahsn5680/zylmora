'use client';
import React, { useState,useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/app/Components/Loader/loader';
import { UserContext } from '@/app/Context/contextProvider';
export default function CartPage() {
      const [loading,setLoading]=useState(true)
  const router = useRouter();
  const { session } = useContext(UserContext)
  const [cartItems, setCartItems] = useState([
    
  ]);
useEffect(()=>{
    if(!session){
      router.replace('/Authentication')
    }
    
  },[])
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

 useEffect(() => {
    const getProduct =async () => {
   
      try {
        if(session?.user?.email){
       const res = await fetch(`/api/Cart?email=${session.user.email}`);
const data = await res.json();

if (data) {
  setCartItems(data);
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
    <div className="p-4 sm:p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
          >
            ← Back
          </button>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">YOUR CART</h1>
        <div className="bg-yellow-100 text-yellow-800 p-3 text-sm rounded mb-6">
          <span className="font-semibold">Please, hurry!</span> Someone has placed an order on one of
          the items in your cart. We’ll keep it for you for <span className="font-bold">10</span> minutes.
        </div>

        {/* Cart Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.length > 0 ? (
              cartItems?.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 flex flex-col sm:flex-row gap-4 rounded shadow"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-28 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">Brand: {item.vendor}</p>
                    <div className="mt-2 text-sm">
                      <span className="line-through text-gray-400 mr-2">Rs.{item.cut_price}</span>
                      <span className="text-red-600 font-semibold">Rs.{item.price}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-1 border rounded"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-3 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between sm:block sm:text-right text-sm text-gray-700">
                    <p className="font-semibold mt-2 sm:mt-0">
                      Rs.{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:underline mt-2 sm:mt-4"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">ORDER SUMMARY</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span className="font-medium">Rs.{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="font-semibold">TOTAL:</span>
              <span className="font-bold">Rs.{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Tax included and shipping calculated at checkout
            </p>
            <button className="w-full bg-black text-white py-2 mb-2 hover:opacity-90">
              PROCEED TO CHECKOUT
            </button>
            <button className="w-full border py-2 hover:bg-gray-100">
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
