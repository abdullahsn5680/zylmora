'use client';
import React, { useState, useEffect, useContext ,useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart, ArrowLeft, MapPin, CreditCard, Package, User, Phone, Mail } from 'lucide-react';
import Loader from '@/app/Components/Loader/loader';
import { UserContext } from '@/app/Context/contextProvider';
import { safeFetch } from '@/Utils/safeFetch';
export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const router = useRouter();
  const [showProceed,setShowProceed]=useState(false)
  const [cartItems, setCartItems] = useState([]);
  const [Orders,setOrders]=useState([]);
  const [processing, setProcessing] = useState(false);
  const [province,setProvince]=useState('');
  const { session } = useContext(UserContext)
  const { user, setUser } = useContext(UserContext);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [finalAddress,setFinalAddresses]=useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [sucess,setSucess]=useState(false);
    const [Alert,setAlert]=useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

   const [update,setUpdate]=useState(0)

 const handleAddress=async()=>{
const addressParts = [streetAddress.trim()]
addressParts.push(city.trim());
addressParts.push(district.trim());
addressParts.push(province.trim());
addressParts.push(postalCode.trim());
addressParts.push(country.trim());
const formatted = addressParts.join(', ')

  setFinalAddresses(formatted);
 return formatted;


}

  const shipping = 0;
  

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

 

  const handleSubmit = async (e) => {
     
    e.preventDefault();
   const address= await handleAddress();
    setProcessing(true);
    setTimeout(() => {
     
const Info={
  userId:session.user.id,
firstName:firstName,
lastName:lastName,
email:email,
phone:phone,
paymentMethod:paymentMethod,
address:address,
}

try{
 const performOrder =async()=>{ 
   if (!navigator.onLine) {
          setAlert(true); 
          setProcessing(false);
          return;
        }
const res = await fetch('/api/cartOrders',{method:'POST',
  headers: { 'Content-Type': 'application/json' },

  body:JSON.stringify({Info,Orders}),
})
const data =await res.json();

if(!data.success){
  setAlert(true)
}else{
  setSucess(true)
}
 }

performOrder();
}catch(err){
  setAlert(true)
}


    setProcessing(false);
    }, 2000);
  };

 

 
  useEffect(() => {
    if (!session) {
      router.replace('/Authentication');
    }
  }, [session, router]);


  
  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  }
  const selectedCartItems = useMemo(() => {
  return cartItems.filter(item => selectedItems.has(item.id));
}, [cartItems, selectedItems]);
  useEffect(() => {
      setOrders(selectedCartItems)
  }, [selectedCartItems]);

  const subtotal = selectedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
const total = subtotal + shipping;
  const increaseQty = async (id) => {


    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    try {
      const response = await safeFetch('/api/Cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action: 'increase',
          email: session?.user?.email,
        }),
      });

      if (!response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  const decreaseQty = async (id) => {
    const currentItem = cartItems.find(item => item.id === id);
    if (currentItem && currentItem.quantity <= 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    try {
      const response = await safeFetch('/api/Cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action: 'decrease',
          email: session?.user?.email,
        }),
      });

      if (!response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    }
  };

  const removeItem = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this item?');
    if (!confirmDelete) return;

    setUpdating(true);
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });

    try {
      const response = await safeFetch('/api/Cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          email: session?.user?.email,
        }),
      });

      if (!response.success) {
        setCartItems((prev) => [...prev, itemToRemove]);
        setSelectedItems(prev => new Set([...prev, id]));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setCartItems((prev) => [...prev, itemToRemove]);
      setSelectedItems(prev => new Set([...prev, id]));
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) return;

    setIsCheckoutDisabled(true);
  setShowProceed(true)
  };

  const handleContinueShopping = () => {
    router.push('/');
  };


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
    const getProduct = async () => {
      try {
        if (session?.user?.email) {
          const res = await fetch(`/api/Cart?email=${session.user.email}`);
          const data = await res.json();

          if (data) {
            setCartItems(data);
           
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        }
      } catch (err) {
        setAlert(true)
        setLoading(false);
      }
    };
    getProduct();
  }, [session?.user?.email]);

  if (loading) return <Loader />;
  if(showProceed){
    return(
   <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
  {/* Header */}
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
              onClick={() => setShowProceed(false)} 
              className="group p-2 hover:bg-slate-100 rounded-xl transition-all duration-300 hover:-translate-x-0.5"
            >
              <ArrowLeft size={20} className="text-slate-600 group-hover:text-slate-800" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Complete Order</h1>
          </div>
        </div>

      
        <div className="hidden lg:flex items-center gap-4 mb-8">
          <button 
            onClick={() => setShowProceed(false)} 
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-gray-100">
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

        {/* Payment Method */}
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
                <p className="font-semibold text-slate-800">Cash on Delivery (COD)</p>
                <p className="text-sm text-slate-600 mt-1">Pay when you receive your order</p>
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

      {/* Right Column - Order Summary */}
      <div className="space-y-6">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl p-8 border border-gray-100 sticky top-6 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">📋</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            {Orders.map((item) => (
              <div key={item.id} className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.vendor} • Size: {item.size}
                  </p>
                  <p className="text-xs text-slate-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                  {item.cut_price && (
                    <div className="text-xs text-slate-500 line-through">
                      Rs. {(item.cut_price * item.quantity).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-800">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3">
              <span className="text-slate-800">Total</span>
              <span className="text-slate-800">Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 mb-6 text-center">
            Tax included and shipping calculated at checkout
          </p>

          <button
            onClick={handleSubmit}
            disabled={processing}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            {processing ? (
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

  {/* Success Modal */}
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
            onClick={() => setShowProceed(false)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Error Modal */}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
  {/* Header Section */}
  <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-white/80 hover:bg-slate-100 rounded-xl sm:rounded-xl md:rounded-2xl text-slate-700 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm sm:text-base font-medium">Back</span>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-lg sm:text-xl md:text-2xl">🛒</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
            Your Cart
          </h1>
        </div>
      </div>
    </div>
  </div>

  <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
    
    {cartItems.length > 0 && (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-amber-800 text-sm sm:text-base font-medium leading-relaxed">
              <span className="font-bold">Please, hurry!</span> Someone has placed an order on one of
              the items in your cart. We'll keep it for you for <span className="font-bold text-orange-600">10</span> minutes.
            </p>
          </div>
        </div>
      </div>
    )}

    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 shrink">
      
      <div className="lg:col-span-2 space-y-4 sm:space-y-6 shrink">
     
        {cartItems.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-5 md:p-6">
            <label className="flex items-center shrink gap-3 sm:gap-4 text-sm sm:text-base font-semibold text-slate-700 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedItems.size === cartItems.length}
                  onChange={handleSelectAll}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 border-slate-300 text-slate-600 focus:ring-slate-500 focus:ring-2 transition-all duration-200"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </div>
              <span className="group-hover:text-slate-600 transition-colors duration-200">
                Select All ({cartItems.length} items)
              </span>
            </label>
          </div>
        )}

        
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-1"
            >
              
              <div className="block sm:hidden">
             
                <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-50/50 to-purple-50/50 border-b border-gray-100">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                        className="w-5 h-5 rounded-lg border-2 border-slate-300 text-slate-600 focus:ring-slate-500 focus:ring-2 transition-all duration-200 mt-1"
                      />
                    </div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden shadow-md border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate group-hover:text-slate-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
                        {item.vendor} • Size: {item.size}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 sm:gap-3">
                      
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      disabled={item.quantity <= 1}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-bold text-slate-600"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-lg sm:text-xl text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 font-bold text-slate-600"
                    >
                      +
                    </button>
                  </div>
                  <div>
                          <div className="text-lg sm:text-xl font-bold text-orange-600">
                            Rs. {item.price.toLocaleString()}
                          </div>
                          {item.cut_price && (
                            <div className="text-xs sm:text-sm text-slate-500 line-through">
                              Rs. {item.cut_price.toLocaleString()}
                            </div>
                          )}
                        </div>
                </div>
              </div>

           
              <div className="hidden sm:block">
                <div className="p-6 md:p-8 flex items-center gap-6 md:gap-8">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                        className="w-6 h-6 rounded-lg border-2 border-slate-300 text-slate-600 focus:ring-slate-500 focus:ring-2 transition-all duration-200"
                      />
                    </div>
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 group-hover:text-slate-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-500">
                      {item.vendor}, Size: {item.size}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="text-right">
                      <div className="text-xl md:text-2xl font-bold text-orange-600">
                        Rs. {item.price.toLocaleString()}
                      </div>
                      {item.cut_price && (
                        <div className="text-sm md:text-base text-slate-500 line-through">
                          Rs. {item.cut_price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        disabled={item.quantity <= 1}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-bold text-slate-600"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-bold text-xl md:text-2xl text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 font-bold text-slate-600"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updating}
                      className="p-3 md:p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

            
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl sm:rounded-t-3xl"></div>
            </div>
          ))
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 md:p-16 text-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
              <span className="text-5xl sm:text-6xl opacity-60">🛒</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-700 mb-3 sm:mb-4">Your cart is empty</h3>
            <p className="text-slate-500 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl sm:rounded-2xl hover:from-slate-800 hover:to-slate-950 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 h-fit sticky top-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Order Summary</h2>
        </div>
        
        <div className="space-y-4 sm:space-y-5 text-sm sm:text-base">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-slate-600">Items ({selectedCartItems.length})</span>
            <span className="font-semibold text-slate-800">Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-bold text-slate-800">Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-slate-600">Shipping</span>
            <span className="text-emerald-600 font-semibold">Free</span>
          </div>
          <div className="flex justify-between items-center py-4 border-t-2 border-slate-200">
            <span className="text-lg sm:text-xl font-bold text-slate-800">TOTAL:</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">Rs. {subtotal.toLocaleString()}</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6 mb-6 sm:mb-8 text-center leading-relaxed">
          Tax included and shipping calculated at checkout
        </p>
        
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={handleCheckout}
            disabled={selectedCartItems.length === 0}
            className="group w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:from-slate-800 hover:to-slate-950 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm sm:text-base transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="group-hover:scale-110 inline-block transition-transform duration-200">
              PROCEED TO CHECKOUT
            </span>
          </button>
          
          <button
            onClick={handleContinueShopping}
            className="w-full border-2 border-slate-200 py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 font-bold text-sm sm:text-base text-slate-700 hover:text-slate-800 transform hover:scale-105"
          >
            CONTINUE SHOPPING
          </button>
        </div>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100">
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-500">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="font-semibold">Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}