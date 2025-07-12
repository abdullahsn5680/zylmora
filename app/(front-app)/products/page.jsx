'use client'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import ImageViewer from '@/app/Components/UI/Img/ImageViewer';
import Card from '@/app/Components/UI/Card/Card';
import Loader from '@/app/Components/Loader/loader';
import { safeFetch } from '@/Utils/safeFetch';
function Page() {
  const router =useRouter();
  const { session } =useContext(UserContext)
  const {user, setUser} = useContext(UserContext);
   const searchParams = useSearchParams();
  const [Counter, setCounter] = useState(1);
  const [Size, setSize] = useState(0);
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRP] = useState([]);
  const [product, setProduct] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  

  useEffect(() => {
    if (user?.address?.length > 0) {
      setAddress(user.address[0]);
    }
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

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
          const origin = window.location.origin;
        const res = await safeFetch(`/api/Products?id=${slug}`,{},360000);
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
        const origin = window.location.origin;
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
    if (!session?.user?.email) return alert('User not logged in');

    try {
      const res = await fetch('/api/Wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, product }),
      });

      const result = await res.json();
      alert(result.success ? 'Added to wishlist' : 'Failed to add to wishlist');
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('Error while adding to wishlist');
    }
  };

  const handleAddCart = async () => {
    if (!Size || !product) return;
    if (!session?.user?.email) return alert('User not logged in');

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
      alert(result.success ? 'Added to cart!' : 'Failed to add to cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error while adding to cart');
    }
  };

  const handleBuyNow = () => {
    if (!Size || !session?.user?.email) return alert('Login and select size!');
    setShowOrderForm(true);
  };

  const handleSubmitOrder = async () => {
    if (!address || !phone) return alert('Address and Phone are required');
    const orderDetails = {
      product: product,
      quantity: Counter,
      size: Size.size,
      address,
      phone,
      user,
    };

    try{
      setLoading(true)
         const res = await fetch('/api/Orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderDetails
        }),
      });
      setLoading(false)
    }catch(err){
      if(err){
        alert('Order Failed');
        return;
      }
    }
    setShowOrderForm(false);
    alert('Order placed!');
    router.push('/Profile/Orders')
    
  };

  const dummyDescription = [
    { id: 1, line: 'This is a high-quality product designed for comfort and style.' },
    { id: 2, line: 'Perfect for everyday use and special occasions.' },
  ];

  
  if (loading) return <Loader />;
console.log('Fetching RelatedProducts with:', product.category, product.subcategory);

  return (
    <div className='mt-10 px-5'>
      <div className="navigation flex gap-2 text-sm text-gray-500">
        <div className="home">Home</div>
        <span>/</span>
        <div className="title">{product?.title || 'Product Title'}</div>
      </div>

      <div className="main flex flex-col md:flex-row justify-between gap-6 md:gap-20 xl:gap-70 mt-6">
        <div className="relative w-full md:w-1/2 aspect-square rounded-xl overflow-hidden">
          <Image
            width={800}
            height={800}
            src={product?.main_image || '/placeholder.png'}
            alt={product?.title || 'Product'}
            className='w-full h-full object-contain rounded-xl'
          />
        </div>

        <div className="info w-full md:w-1/2 flex flex-col justify-start md:gap-4 gap-3">
          <div className="w-full text-3xl font-bold text-slate-700 tracking-wide relative">
            <span className="drop-shadow-md">{product?.title || 'Product Title'}</span>
          </div>

          <div className="p_info text-sm text-gray-600 mt-2">
            <p>Vendor: {product?.Vendor || 'Vendor'}</p>
            <p>Product Type: {product?.subcategory || 'General'}</p>
          </div>

          <div className="sizes flex gap-2 mt-4">
            {(product?.sizes || ['XS', 'M', 'L']).map((size, index) => (
              <span
                key={index}
                onClick={() => setSize(size)}
                className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md ${
                  Size === size &&
                  'bg-red-500 text-white font-bold border-2 border-black hover:text-white'
                } hover:bg-red-100 text-sm`}
              >
                {size.size}
              </span>
            ))}
          </div>

          <div className="mt-2 text-md text-slate-800">
            Subtotal: <span className="text-red-600">{product?.cut_price || '0'} PKR</span>
          </div>

          <div className="order mt-3 w-full">
            <div className="quantity font-medium mb-2">Quantity</div>
            <div className="buttons hidden md:flex flex-col md:flex-row gap-3">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => Counter > 1 && setCounter(Counter - 1)}>-</button>
              <div className="quanttiy px-4 py-2 border rounded">{Counter}</div>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setCounter(Counter + 1)}>+</button>
              <button
                onClick={handleAddCart}
                disabled={!Size}
                className={`addToCart px-4 py-2 w-full rounded text-white ${
                  !Size ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Add to Cart
              </button>
              <button onClick={handleAddWishlist} className="wishList px-4 py-2 bg-gray-100 hover:bg-gray-300 border rounded-full">
                <Heart />
              </button>
            </div>
          </div>

          <div className="butNowBtn w-full">
            <button
              onClick={handleBuyNow}
              disabled={!Size}
              className={`addToCart px-4 py-2 w-full rounded-sm font-bold border-2 transition-all duration-300 ${
                !Size ? 'bg-gray-400 cursor-not-allowed' : 'bg-white hover:bg-black hover:text-white'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="more_img md:mt-40 mt-30 w-full flex justify-center items-center">
        <ImageViewer images={product?.images || []} />
      </div>

      <div className="description mt-30 md:mt-40">
        <div className="w-full text-center text-3xl font-bold text-slate-700 mb-6 tracking-wide relative">
          <span className="inline-block bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
            Product Description
          </span>
          <div className="w-20 h-1 bg-red-400 mx-auto mt-2 rounded-full"></div>
        </div>

        {(product?.description || dummyDescription).map((data) => (
          <div className="text-sm" key={data.id}>
            {data.id === 1 ? (
              <p className="pt-2 pb-5">{data.line}</p>
            ) : (
              <p className="py-1">➤ {data.line}</p>
            )}
          </div>
        ))}
      </div>

      <div className="related_products mt-20 md:mt-30">
        <div className="w-full text-center text-3xl font-bold text-slate-700 mb-6 tracking-wide relative">
          <span className="inline-block bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
            Related Products
          </span>
          <div className="w-20 h-1 bg-red-400 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="relative">
          <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-2 z-10 -translate-y-1/2">
            <button onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })} className="bg-black shadow px-2 py-2 rounded-full text-white">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })} className="bg-black shadow px-2 py-2 rounded-full text-white">
              <ChevronRight size={24} />
            </button>
          </div>

          <div ref={scrollRef} className="flex overflow-x-auto gap-5 px-20 no-scrollbar scroll-smooth">
            {relatedProducts.map((item) => (
              <div className="min-w-[250px] py-5 max-w-xs" key={item._id}>
                <Card prop={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showOrderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">
            <button onClick={() => setShowOrderForm(false)} className="absolute top-2 right-3 text-gray-500 hover:text-black">✕</button>
            <h2 className="text-xl font-bold mb-4">Complete Your Order</h2>
            <p className="mb-1 text-sm font-medium">Product: {product?.title}</p>
            <p className="text-sm">Size: {Size?.size}</p>
            <p className="text-sm">Quantity: {Counter}</p>
            <p className="text-sm mb-3">Total: {product?.cut_price * Counter} PKR</p>

            <label className="block mb-1 font-semibold text-sm">Select Address</label>
            <select
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded p-2 mb-4 text-sm"
            >
              <option value="">Select an address</option>
              {(user?.address || []).map((addr, i) => (
                <option key={i} value={addr}>{addr}</option>
              ))}
            </select>

            <label className="block mb-1 font-semibold text-sm">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded p-2 mb-4 text-sm"
            />

            <button disabled={loading} onClick={handleSubmitOrder} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
