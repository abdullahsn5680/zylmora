'use client'
import React from 'react'

function Order_Summary({
  product,
  Counter,
  Size,
  firstName,
  lastName,
  email,
  phone,
  selectedAddress,
  streetAddress,
  city,
  district,
  province,
  postalCode,
  country,
  paymentMethod,
  setFinalAddresses,
  setShowOrderForm,
  setLoading,
  setSucess,
  setShowAlert,
  loading,
  user,
}) {
  const calculateTotal = () => {
    const productPrice = product?.cut_price || 0;
    const shipping = 250;
    return productPrice * Counter + shipping;
  };

  const handleAddress = async () => {
    const addressParts = [
      streetAddress.trim(),
      city.trim(),
      district.trim(),
      province.trim(),
      postalCode.trim(),
      country.trim(),
    ];
    const formatted = addressParts.join(', ');
    setFinalAddresses(formatted);
    return formatted;
  };

  const handleSubmitOrder = async () => {
    const addr = await handleAddress();
    if (!selectedAddress || !firstName || !lastName || !email || !phone) {
      alert('Please fill all required fields');
      return;
    }

    if (!Size) {
      alert('Please select a size');
      return;
    }

    const orderDetails = {
      product,
      quantity: Counter,
      size: Size.size,
      address: addr,
      firstName,
      lastName,
      email,
      phone,
      paymentMethod,
      user,
    };

    try {
      setLoading(true);
      const res = await fetch('/api/Orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderDetails }),
      });

      const result = await res.json();
      setLoading(false);

      if (result.success) {
        setSucess(true);
        setShowOrderForm(false);
      } else {
        setShowAlert(true);
      }
    } catch (err) {
      setLoading(false);
      console.error('Order error:', err);
      setShowAlert(true);
    }
  };

  return (
          <div className="space-y-6">
           <div className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl p-8 border border-gray-100 sticky top-6 transition-all duration-500">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                 <span className="text-white text-lg">📋</span>
               </div>
               <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
             </div>
             
             <div className="space-y-4 mb-8">
              
                 <div className="group  items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-300 border border-gray-100">
                   <div className="flex items-center  p-4 gap-4">
                   <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                     <img
                       src={product.main_image}
                       alt={product.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="text-sm font-semibold text-slate-800 truncate">
                       {product.title}
                     </h3>
                     <p className="text-xs text-slate-500 mt-1">
                       {product.vendor} • Size: {Size.size}
                     </p>
                     <p className="text-xs text-slate-500">
                       Qty: {Counter}
                     </p>
                   </div>
                       <div className="text-right hidden 
                   sm:block">
                     <div className="text-sm  font-semibold text-slate-800">
                       Rs. {(product.cut_price ).toLocaleString()}
                     </div>
                     {product.cut_price && (
                       <div className="text-xs   text-slate-500 line-through">
                         Rs. {(product.price ).toLocaleString()}
                       </div>
                     )}
                   </div>
                   </div>
                   <div className="text-right flex justify-end items-center gap-2 sm:hidden">
                     <div className="text-sm  font-semibold text-slate-800">
                       Rs. {(product.price ).toLocaleString()}
                     </div>
                     {product.cut_price && (
                       <div className="text-xs   text-slate-500 line-through">
                         Rs. {(product.cut_price ).toLocaleString()}
                       </div>
                     )}
                   </div>
                 </div>
          
             </div>
   
             <div className="space-y-3 text-sm border-t border-gray-200 pt-6">
               <div className="flex justify-between">
                 <span className="text-slate-600">Subtotal</span>
                 <span className="font-medium text-slate-800">Rs. {(product.cut_price * Counter).toLocaleString()}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-600">Shipping</span>
                 <span className="text-emerald-600 font-medium">Free</span>
               </div>
               <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3">
                 <span className="text-slate-800">Total</span>
                 <span className="text-slate-800">Rs. {calculateTotal().toLocaleString()}</span>
               </div>
             </div>
   
             <p className="text-xs text-slate-500 mt-4 mb-6 text-center">
               Tax included and shipping calculated at checkout
             </p>
   
             <button
               onClick={handleSubmitOrder}
               disabled={loading}
               className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
             >
              {loading ? (
                 <div className="flex items-center justify-center gap-2">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   PROCESSING...
                 </div>
               ) : (
                 'PLACE ORDER'
               )} 
             </button>
   
             <div className="mt-6 pt-6 border-t border-gray-200">
               <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
                 <span>Secure SSL Encrypted Payment</span>
               </div>
             </div>
           </div>
         </div>
  )
}

export default Order_Summary
