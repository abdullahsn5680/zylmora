'use client'
import React from 'react'
import { ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

function Complete_Order({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  selectedAddress,
  setSelectedAddress,
  streetAddress,
  setStreetAddress,
  city,
  setCity,
  district,
  setDistrict,
  province,
  setProvince,
  postalCode,
  setPostalCode,
  country,
  setCountry,
  update,
  setUpdate,
  paymentMethod,
  setPaymentMethod,
  user,
  setShowOrderForm
}) {
  const router = useRouter()
  return (
    <div className="space-y-8">
         
           <div className="lg:hidden bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-100">
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setShowOrderForm(false)} 
                 className="group p-2 hover:bg-slate-100 rounded-xl transition-all duration-300 hover:-translate-x-0.5"
               >
                 <ArrowLeft size={20} className="text-slate-600 group-hover:text-slate-800" />
               </button>
               <h1 className="text-xl font-bold text-slate-800">Complete Order</h1>
             </div>
           </div>
   
         
           <div className="hidden lg:flex items-center gap-4 mb-8">
             <button 
               onClick={() =>  setShowOrderForm(false)} 
               className="group p-3 hover:bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 hover:-translate-x-0.5 shadow-sm hover:shadow-md"
             >
               <ArrowLeft size={20} className="text-slate-600 group-hover:text-slate-800" />
             </button>
             <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Complete Your Order</h1>
           </div>
   
           <div className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl p-8 border border-gray-100 transition-all duration-500">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                 <User size={20} className="text-white" />
               </div>
               <h2 className="text-xl font-bold text-slate-800">Contact Information</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-semibold text-slate-600 mb-2">
                   First Name *
                 </label>
                 <input
                   type="text"
                   value={firstName}
                   onChange={(e) => setFirstName(e.target.value)}
                   className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50 focus:bg-white hover:border-gray-300 transition-all duration-300"
                   placeholder="Enter first name"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-600 mb-2">
                   Last Name *
                 </label>
                 <input
                   type="text"
                   value={lastName}
                   onChange={(e) => setLastName(e.target.value)}
                   className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50 focus:bg-white hover:border-gray-300 transition-all duration-300"
                   placeholder="Enter last name"
                   required
                 />
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
               <div>
                 <label className="block text-sm font-semibold text-slate-600 mb-2">
                   Email *
                 </label>
                 <div className="relative">
                   <Mail size={18} className="absolute left-4 top-4 text-slate-400" />
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50 focus:bg-white hover:border-gray-300 transition-all duration-300"
                     placeholder="Enter email address"
                     required
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-600 mb-2">
                   Phone *
                 </label>
                 <div className="relative">
                   <Phone size={18} className="absolute left-4 top-4 text-slate-400" />
                   <input
                     type="tel"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50 focus:bg-white hover:border-gray-300 transition-all duration-300"
                     placeholder="Enter phone number"
                     required
                   />
                 </div>
               </div>
             </div>
           </div>
   
         
           <div className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl p-8 border border-gray-100 transition-all duration-500">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                 <MapPin size={20} className="text-white" />
               </div>
               <h2 className="text-xl font-bold text-slate-800">Delivery Address</h2>
             </div>
   
             <div className="mb-6">
               <label className="block text-sm font-semibold text-slate-600 mb-2">
                 Select Address *
               </label>
               {user?.address && user.address.length > 0 ? (
                 <select
                   value={selectedAddress}
                   onChange={(e) => { setSelectedAddress(e.target.value); setUpdate(0) }}
                   className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50 focus:bg-white hover:border-gray-300 transition-all duration-300"
                   required
                 >
                   <option value="">Select an address</option>
                   {user.address.map((addr, index) => (
                     <option key={index} value={addr}>
                       {addr.length > 60 ? `${addr.substring(0, 60)}...` : addr}
                     </option>
                   ))}
                 </select>
               ) : (
                 <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                   <p className="text-sm text-amber-800 mb-3 font-medium">No addresses found</p>
                   <button
                     onClick={() => router.push('/Profile/Address')}
                     className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                   >
                     Add Address
                   </button>
                 </div>
               )}
             </div>
   
             {selectedAddress && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6  rounded-xl ">
                 <div>
                   <label className="block text-sm font-semibold text-slate-600 mb-2">
                     Street Address
                   </label>
                   <input
                     type="text"
                     value={streetAddress}
                     onChange={(e) => { setStreetAddress(e.target.value); setUpdate(update + 1); }}
                     className="w-full p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-all duration-300"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-600 mb-2">
                     City
                   </label>
                   <input
                     type="text"
                     value={city}
                     onChange={(e) => { setCity(e.target.value); setUpdate(update + 1); }}
                     className="w-full p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-all duration-300"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-600 mb-2">
                     District
                   </label>
                   <input
                     type="text"
                     value={district}
                     onChange={(e) => { setDistrict(e.target.value); setUpdate(update + 1); }}
                     className="w-full p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-all duration-300"
                   />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-slate-600 mb-2">
                     Province
                   </label>
                   <input
                     type="text"
                     value={province}
                     onChange={(e) => { setProvince(e.target.value); setUpdate(update + 1); }}
                     className="w-full p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-all duration-300"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-600 mb-2">
                     Postal Code
                   </label>
                   <input
                     type="text"
                     value={postalCode}
                     onChange={(e) => { setPostalCode(e.target.value); setUpdate(update + 1); }}
                     className="w-full p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-all duration-300"
                   />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-slate-600 mb-2">
                     Country
                   </label>
                   <input
                     type="text"
                     value={country}
                     onChange={(e) => { setCountry(e.target.value); setUpdate(update + 1); }}
                     className="w-full p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-all duration-300"
                   />
                 </div>
               </div>
             )}
           </div>
   
           <div className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl p-8 border border-gray-100 transition-all duration-500">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                 </svg>
               </div>
               <h2 className="text-xl font-bold text-slate-800">Payment Method</h2>
             </div>
   
             <div className="space-y-4">
               <label className="group flex items-center p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 has-[:checked]:border-slate-400 has-[:checked]:bg-slate-50">
                 <input
                   type="radio"
                   name="payment"
                   value="cod"
                   checked={paymentMethod === 'cod'}
                   onChange={(e) => setPaymentMethod(e.target.value)}
                   className="w-5 h-5 text-slate-600 mr-4"
                 />
                 <div className="flex-1">
                   <p className="font-semibold  text-slate-800">Cash on Delivery (COD)</p>
                   <p className="md:text-sm text-[10px]  text-slate-600 mt-1">Pay when you receive your order</p>
                 </div>
                 <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                   <span className="text-emerald-600 text-lg">💵</span>
                 </div>
               </label>
               
               <label className="flex items-center p-6 border-2 border-gray-200 rounded-xl cursor-not-allowed opacity-50 bg-gray-50">
                 <input
                   type="radio"
                   name="payment"
                   value="card"
                   disabled
                   className="w-5 h-5 mr-4"
                 />
                 <div className="flex-1">
                   <p className="font-semibold text-gray-600">Credit/Debit Card</p>
                   <p className="text-sm text-gray-500 mt-1">Coming soon</p>
                 </div>
                 <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                   <span className="text-gray-400 text-lg">💳</span>
                 </div>
               </label>
             </div>
           </div>
         </div>
  )
}

export default Complete_Order
