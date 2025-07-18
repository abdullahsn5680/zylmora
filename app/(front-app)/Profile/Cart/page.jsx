'use client';
import React, { useState, useEffect, useContext } from 'react';
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
firstName:firstName,
lastName:lastName,
email:email,
phone:phone,
paymentMethod:paymentMethod,
address:address,
}

try{
 const perform =async()=>{ 
const res = await fetch('/api/cartOrders',{method:'POST',
  headers: { 'Content-Type': 'application/json' },

  body:JSON.stringify({Info}),
})
const data =await res.json();


 }
alert('Cart order whould be avialable in next update ')
//perform();
}catch(err){}


    setProcessing(false);
      alert('Order placed successfully!');

    }, 2000);
  };

 

 
  useEffect(() => {
    if (!session) {
      router.replace('/Authentication');
    }
  }, [session, router]);

  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  }, [cartItems]);
  
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
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
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
        console.error(err);
        setLoading(false);
      }
    };
    getProduct();
  }, [session?.user?.email]);

  if (loading) return <Loader />;
  if(showProceed){
    return(
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowProceed(false)}
              className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
            >
              ← Back to Cart
            </button>
            <h1 className="text-xl sm:text-2xl font-bold">Checkout</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
          <div className="lg:hidden bg-white shadow-sm p-4 flex items-center gap-3">
          <button onClick={() => setShowOrderForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Complete Order</h1>
        </div>

        
            
              <div className="hidden lg:flex items-center gap-3 mb-6">
                <button onClick={() => setShowOrderForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Complete Your Order</h1>
              </div>         
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <User size={20} className="text-gray-600" />
                  <h2 className="text-lg font-semibold">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-gray-600" />
                  <h2 className="text-lg font-semibold">Delivery Address</h2>
                </div>

              
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Address *
                  </label>
                  {user?.address && user.address.length > 0 ? (
                    <select
                      value={selectedAddress}
                      onChange={(e) =>{ setSelectedAddress(e.target.value);setUpdate(0)}}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">No addresses found</p>
                      <button
                        onClick={() => router.push('/Profile/Address')}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </div>

           {selectedAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e)=>{setStreetAddress(e.target.value); setUpdate(update+1);}}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                       
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e)=>{setCity(e.target.value); setUpdate(update+1);}}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                       
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District
                      </label>
                      <input
                        type="text"
                        value={district}
                          onChange={(e)=>{setDistrict(e.target.value); setUpdate(update+1);}}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                       
                      />
                    </div>
                     <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province
                      </label>
                      <input
                        type="text"
                        value={province}
                          onChange={(e)=>{setProvince(e.target.value); setUpdate(update+1);}}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                        
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                          onChange={(e)=>{setPostalCode(e.target.value); setUpdate(update+1);}}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                   
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                          onChange={(e)=>{setCountry(e.target.value); setUpdate(update+1);}}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                        
                      />
                    </div>
                  </div>
                )}
                
              </div>
   <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      disabled
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Coming soon</p>
                    </div>
                  </label>
                </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm  sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.vendor} • Size: {item.size}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                      {item.cut_price && (
                        <div className="text-xs text-gray-500 line-through">
                          Rs. {(item.cut_price * item.quantity).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3 mb-4">
                Tax included and shipping calculated at checkout
              </p>

              <button
                onClick={handleSubmit}
                disabled={processing}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {processing ? 'PROCESSING...' : 'PLACE ORDER'}
              </button>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
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
    </div>
  );
}
  
  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-sm px-4 py-2 bg-white hover:bg-gray-50 rounded-md text-gray-700 transition-colors border"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-4">YOUR CART</h1>
        
        {cartItems.length > 0 && (
          <div className="bg-yellow-100 text-yellow-800 p-3 text-sm rounded mb-6">
            <span className="font-semibold">Please, hurry!</span> Someone has placed an order on one of
            the items in your cart. We'll keep it for you for <span className="font-bold">10</span> minutes.
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 && (
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cartItems.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Select All ({cartItems.length} items)
                </label>
              </div>
            )}

            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    {/* Product Info Section */}
                    <div className="p-4 bg-pink-50 border-b">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                        />
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.vendor} • {item.size}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-orange-600">
                              Rs. {item.price.toLocaleString()}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={updating}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          {item.cut_price && (
                            <span className="text-xs text-gray-500 line-through">
                              Rs. {item.cut_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

               
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <div className="p-4 flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.vendor}, Size:{item.size}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-600">
                            Rs. {item.price.toLocaleString()}
                          </div>
                          {item.cut_price && (
                            <div className="text-xs text-gray-500 line-through">
                              Rs. {item.cut_price.toLocaleString()}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={updating}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Looks like you haven't added any items to your cart yet.</p>
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border h-fit">
            <h2 className="text-lg font-semibold mb-4">ORDER SUMMARY</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items ({selectedCartItems.length})</span>
                <span>Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>TOTAL:</span>
                <span>Rs.{subtotal.toLocaleString()}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 mb-4">
              Tax included and shipping calculated at checkout
            </p>
            
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={selectedCartItems.length === 0 || isCheckoutDisabled}
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isCheckoutDisabled ? 'PROCESSING...' : 'PROCEED TO CHECKOUT'}
              </button>
              
              <button
                onClick={handleContinueShopping}
                className="w-full border py-3 rounded hover:bg-gray-50 transition-colors font-medium"
              >
                CONTINUE SHOPPING
              </button>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}