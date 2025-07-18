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
      alert(`hit ${update}`)
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
      <div className="min-h-screen bg-gray-50 pb-20">
      
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center gap-3">
          <button onClick={() => setShowOrderForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Complete Order</h1>
        </div>

        <div className="lg:flex lg:min-h-screen">
        
          <div className="lg:w-1/2 bg-white lg:overflow-y-auto">
            <div className="p-6 lg:p-8">
            
              <div className="hidden lg:flex items-center gap-3 mb-6">
                <button onClick={() => setShowOrderForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Complete Your Order</h1>
              </div>

            
              <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={product.main_image || '/placeholder.png'}
                      alt={product.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{product.title}</h3>
                    <p className="text-xs text-gray-600">Size: {Size.size}</p>
                    <p className="text-xs text-gray-600">Quantity: {Counter}</p>
                    <p className="text-sm font-semibold text-red-600">
                      Rs {(product.cut_price * Counter).toLocaleString()}
                    </p>
                  </div>
                </div>
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
                      onChange={(e) => {setSelectedAddress(e.target.value);setUpdate(0)}}
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

             
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-gray-600" />
                  <h2 className="text-lg font-semibold">Payment Method</h2>
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

           
              <div className="lg:hidden">
                <button
                  onClick={handleSubmitOrder}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Complete Order - Rs {calculateTotal().toLocaleString()}
                </button>
              </div>
            </div>
          </div>

       
          <div className="hidden lg:block lg:w-1/2 bg-gray-50 border-l border-gray-200">
            <div className="p-8 sticky top-0">
              <div className="flex items-center gap-2 mb-6">
                <Package size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

            
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={product.main_image || '/placeholder.png'}
                      alt={product.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">Vendor: {product.Vendor}</p>
                    <p className="text-sm text-gray-600">Size: {Size.size}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm">Quantity:</span>
                  <span className="font-medium">{Counter}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Unit Price:</span>
                  <span className="font-medium">Rs {product.cut_price?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center py-2">
                  <span>Subtotal:</span>
                  <span>Rs {(product.cut_price * Counter).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Shipping:</span>
                  <span>Rs 250</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      Rs {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Complete Order
              </button>

              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🔒 Your order is safe
                </p>
              </div>
            </div>
          </div>
        </div>
            
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
    
        <div className="relative w-full lg:w-1/2">
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
        
          <div className="mb-6">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight tracking-tight mb-2">
              {product?.title || 'Product Title'}
            </h1>
            <div className="w-16 h-0.5 bg-gray-900"></div>
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

      <div className="more_img mb-20 w-full">
        <ImageViewer images={product?.images || []} />
      </div>

     
      <div className="description mb-20  px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">
            Product Description
          </h2>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">
            Related Products
          </h2>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
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
              <div className="min-w-[280px] py-6" key={item._id}>
                <Card prop={item} />
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
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