'use client'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart, ArrowLeft, MapPin, CreditCard, Package, User, Phone, Mail } from 'lucide-react';
import ImageViewer from '@/app/Components/UI/Img/ImageViewer';
import Card from '@/app/Components/UI/Card/Card';
import Loader from '@/app/Components/Loader/loader';
import { safeFetch } from '@/Utils/safeFetch';

function ProductPage() {
  const router = useRouter();
  const [finalAddress,setFinalAddresses]=useState('')
  const { session } = useContext(UserContext)
  const { user } = useContext(UserContext);
  const searchParams = useSearchParams();
  const [Counter, setCounter] = useState(1);
  const [Size, setSize] = useState(0);
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRP] = useState([]);
  const [product, setProduct] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [firstName, setFirstName] = useState('');
  const [province,setProvince]=useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [confirmLogin,setConfirmLogin]=useState(true);
  const [sucess,setSucess]=useState(false);
  const [Alert,setAlert]=useState(false);
  const [update,setUpdate]=useState(0)
  const parseAddressString = (addressString) => {
    if (!addressString) return {};
    
    const parts = addressString.split(',').map(part => part.trim());
    const length = parts.length;
    
    if (length < 4) return {};
    
    const country = parts[length - 1];
    const postalCode = parts[length - 2];
   const province =parts[length -3]
    const district = parts[length - 4];
    const city = parts[length - 5];
 
    const streetParts = parts.slice(0, length - 5);
    const streetAddress = streetParts.join(', ');
    
    return {
      country: country || '',
      postalCode: postalCode || '',
      province: province || '',
      district: district || '',
      city: city || '',
      streetAddress: streetAddress || ''
    };
  };

  useEffect(() => {
    if (selectedAddress&&update==0) {
      
      const parsed = parseAddressString(selectedAddress);
      setCountry(parsed.country || '');
      setPostalCode(parsed.postalCode || '');
      setProvince(parsed.province || '');
      setDistrict(parsed.district || '');
      setCity(parsed.city || '');
      setStreetAddress(parsed.streetAddress || '');
    }
  }, [selectedAddress]);


  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || session?.user?.email || '');
      setPhone(user.phone || '');
      
   
      if (user.address && user.address.length > 0 &&update==0 ) {
       
        setSelectedAddress(user.address[0]);
      }
    }
  }, [user, session]);

  useEffect(() => {
    if (product && product.sizes?.length > 0) {
      const defaultSize = product.sizes[0];
      setSize(defaultSize);
    }
  }, [product]);

  const slug = searchParams.get('url');

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await safeFetch(`/api/Products?id=${slug}`, {}, 360000);
        const data = res
        setProduct(data.product);
        if (data.success) {
          setTimeout(() => setLoading(false), 2000);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getProduct();
  }, [slug]);

  useEffect(() => {
    if (!product._id || !product.category || !product.subcategory) return;

    const getRp = async () => {
      const Query = new URLSearchParams({
        category: product.category,
        subcategory: product.subcategory,
      });
      const res = await safeFetch(`/api/RelatedProducts/?${Query.toString()}`);
      const data = res
      if (data.success) {
        const related = data.products.filter(p => p._id !== product._id);
        setRP(related);
      }
    };

    getRp();
  }, [product._id, product.category, product.subcategory]);

  const handleAddWishlist = async () => {
    if (!product) return;
    if (!session?.user?.email) return setConfirmLogin(false)

    try {
      const res = await fetch('/api/Wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, product }),
      });

      const result = await res.json();
      setSucess(true)
    } catch (err) {
      console.error('Error adding to wishlist:', err);
     setAlert(true)
    }
  };

  const handleAddCart = async () => {
    if (!Size || !product) return;
    if (!session?.user?.email) return setConfirmLogin(true)

    try {
      const res = await fetch('/api/Cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          product,
          quantity: Counter,
          size: Size.size,
        }),
      });

      const result = await res.json();
      setSucess(true)
    } catch (err) {
      console.error('Error adding to cart:', err);
    setAlert(true)
    }
  };

  const handleBuyNow = () => {
    if (!Size || !session?.user?.email) return setConfirmLogin(false);
    setShowOrderForm(true);
  };


    const handleAddress=async()=>{
const addressParts = [streetAddress.trim()]
addressParts.push(city.trim());
addressParts.push(district.trim());
addressParts.push(province.trim());
addressParts.push(postalCode.trim());
addressParts.push(country.trim());
const formatted = addressParts.join(', ')
setFinalAddresses(formatted)
return formatted;
}

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
      product: product,
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
setSucess(true)
        setShowOrderForm(false);
       
      } else {
       setAlert(true)
      }
    } catch (err) {
      setLoading(false);
      console.error('Order error:', err);
    setAlert(true)
    }
  };

  const calculateTotal = () => {
    const productPrice = product?.cut_price || 0;
    const subtotal = productPrice * Counter;
    const shipping = 250; 
    return subtotal + shipping;
  };

  const dummyDescription = [
    { id: 1, line: 'This is a high-quality product designed for comfort and style.' },
    { id: 2, line: 'Perfect for everyday use and special occasions.' },
  ];

  
  if (loading) return <Loader />;
    
  
  if (showOrderForm) {
    return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
    
     <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
               <span className="text-2xl">🛒</span>
             </div>
             <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Checkout</h1>
           </div>
           <div className="w-20"></div>
         </div>
       </div>
     </div>
   
     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
       <div className="grid lg:grid-cols-2 gap-8">
       
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
       </div>
     </div>
   
     {sucess == true && (
       <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center p-4 z-50">
         <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100">
           <div className="text-center">
             <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Success!</h3>
             <p className="text-slate-600 mb-6">Task performed successfully.</p>
             <button
               onClick={() => setShowOrderForm(false)}
               className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
             >
               Go Back
             </button>
           </div>
         </div>
       </div>
     )}
   
     {Alert == true && (
       <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center p-4 z-50">
         <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100">
           <div className="text-center">
             <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Error</h3>
             <p className="text-slate-600 mb-6">Something went wrong.</p>
             <button
               onClick={() => setAlert(false)}
               className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
             >
               Ok
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
     );
   }
  return (
 <div className='mt-12 pb-15  max-w-7xl mx-auto'>
      
      <div className="navigation px-6 flex items-center gap-3 text-sm text-gray-600 mb-8">
        <div className="home font-medium hover:text-gray-900 cursor-pointer transition-colors">Home</div>
        <span className="text-gray-400">•</span>
        <div className="title text-gray-900 font-medium">{product?.title || 'Product Title'}</div>
      </div>

    
      <div className="main flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 px-6 mb-16">
    
        <div className="relative w-full lg:w-[40vw]">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-lg border border-gray-100">
            <Image
              width={800}
              height={800}
              src={product?.main_image || '/placeholder.png'}
              alt={product?.title || 'Product'}
              className='w-full h-full object-contain rounded-2xl hover:scale-105 transition-transform duration-500'
            />
          </div>
        </div>

      
        <div className="info w-full lg:w-1/2 flex flex-col justify-start">
       

            <div className="text-center mb-16">
          <h2 className="text-4xl font-extralight text-gray-900 mb-6 tracking-wider">
          {product?.title || 'Product Title'}
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
        </div>
          <div className="p_info text-gray-600 mb-6 space-y-2">
            <p className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Vendor:</span>
              <span className="text-gray-700">{product?.Vendor || 'Vendor'}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Category:</span>
              <span className="text-gray-700">{product?.subcategory || 'General'}</span>
            </p>
          </div>

          <div className="sizes mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
            <div className="flex gap-3">
              {(product?.sizes || ['XS', 'M', 'L']).map((size, index) => (
                <span
                  key={index}
                  onClick={() => setSize(size)}
                  className={`cursor-pointer px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                    Size === size
                      ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {size.size}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="text-3xl font-light text-gray-900">
              <span className="text-2xl text-gray-600">PKR</span> {product?.cut_price || '0'}
            </div>
          </div>

         
          <div className="order mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => Counter > 1 && setCounter(Counter - 1)}
                >
                  −
                </button>
                <div className="px-6 py-2 border-l border-r border-gray-300 font-medium text-gray-900">
                  {Counter}
                </div>
                <button 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setCounter(Counter + 1)}
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddWishlist}
                className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddCart}
                disabled={!Size}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  !Size 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>

      
          <div className="butNowBtn">
            <button
              onClick={handleBuyNow}
              disabled={!Size}
              className={`w-full py-3 px-6 rounded-lg font-medium border-2 transition-all duration-200 ${
                !Size 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200' 
                  : 'bg-white text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="more_img mb-20 w-full ">
        <ImageViewer images={product?.images || []} />
      </div>

     
      <div className="description mb-20  px-6">
      <div className="text-center mb-16">
          <h2 className="text-4xl font-extralight text-gray-900 mb-6 tracking-wider">
           Prodcut Description
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
        </div>

        <div className="max-w-4xl  ">
          {(product?.description || dummyDescription).map((data) => (
            <div className="text-gray-700 leading-relaxed" key={data.id}>
              {data.id === 1 ? (
                <p className="text-lg mb-6 font-light">{data.line}</p>
              ) : (
                <p className="mb-3 flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{data.line}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="related_products">
       
  <div className="text-center mb-16">
          <h2 className="text-4xl font-extralight text-gray-900 mb-6 tracking-wider">
            Related Products
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
        </div>
        <div className="relative">
     
          <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-4 z-10 -translate-y-1/2">
            <button 
              onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })} 
              className="bg-white shadow-lg border border-gray-200 px-3 py-3 rounded-full text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })} 
              className="bg-white shadow-lg border border-gray-200 px-3 py-3 rounded-full text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>

         
          <div ref={scrollRef} className="flex overflow-x-auto gap-6 px-16 no-scrollbar scroll-smooth">
            {relatedProducts.map((item) => (
              <div className="  py-6" key={item._id}>
                <Card prop={item} isRelated={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
       {confirmLogin !== true && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Requires Login</h3>
              <p className="text-gray-600 mb-6">You are not logged in please login first.</p>
              <div className="flex justify-end gap-3">
            
                <button
                  onClick={() => router.push('./Authentication')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
            {sucess == true && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sucess</h3>
              <p className="text-gray-600 mb-6">Task perfrom sucessfully.</p>
              <div className="flex justify-end gap-3">
            
                <button
                  onClick={() => setSucess(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
            {Alert == true && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
              <p className="text-gray-600 mb-6">Some Thing Went Wrong.</p>
              <div className="flex justify-end gap-3">
            
                <button
                  onClick={() => setAlert(false)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default ProductPage;