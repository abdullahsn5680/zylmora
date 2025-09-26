'use client'
import React from 'react'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAlert } from '@/app/Provider/Alert/AlertProvider'
import { safeFetch } from '@/Utils/safeFetch'
import { useLoader } from '@/app/Provider/loader/loaderProvider'
function ProdcutInfo({
  product,
  Size,
  setSize,
  Counter,
  setCounter,
  session,

  setShowOrderForm
}) {
  const {showAlert} = useAlert();
  const {showLoader,hideLoader} =useLoader();
   
  const router=useRouter();
      
  const handleAddWishlist = async () => {
    if (!product) return;
    if (!session?.user?.email) return handelLogin();
    
    try {
      showLoader();
      const res = await safeFetch('/api/Wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, product }),
      });

      await res
      hideLoader();
     showAlert.success("Added to wishlist successfully");
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    showAlert.error("Unable to add to wishlist")
    }
  };

  const handleAddCart = async () => {
    if (!Size || !product) return;
    if (!session?.user?.email) return handelLogin();

    try {
      showLoader();
      const res = await safeFetch('/api/Cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          product,
          quantity: Counter,
          size: Size.size || Size,
        }),
      });

      await res
      hideLoader();
    showAlert.success("Added to cart successfully");
    } catch (err) {
      console.error('Error adding to cart:', err);
       showAlert.error("Unable to load to cart")
    }
  };

  const handleBuyNow = () => {
    if (!Size || !session?.user?.email) return handelLogin();

    setShowOrderForm(true);
  };
   const handelLogin=()=>{
    showAlert.confirm('You need to be logged in to continue. Would you like to login now?',
  () => {router.push('/Authentication')}, 
  {
    title: "Login Required",
    confirmText: "Login",
    cancelText: "Cancel",
    onCancel: () => {console.log('User cancel the action')}
  })
   }
  return (
  <div className="main flex flex-col lg:flex-row justify-between gap-6 lg:gap-16 px-2 sm:px-4 lg:px-8 mb-16">
  
  <div className="relative w-full lg:w-[40vw] group">
    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-50 to-slate-100 shadow-md border border-slate-200/60 hover:shadow-2xl transition-all duration-500">
      <Image
        width={800}
        height={800}
        src={product?.main_image || '/placeholder.png'}
        alt={product?.title || 'Product'}
        className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-110"
      />
    </div>
  </div>

 
  <div className="info w-full lg:w-1/2 flex flex-col justify-start bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-slate-200/60 hover:shadow-xl transition-all duration-500">
    
    <div className="text-center mb-8 lg:mb-16">
      <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-slate-800 mb-4 lg:mb-6">
        {product?.title || 'Product Title'}
      </h2>
      <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 mx-auto rounded-full"></div>
    </div>

   
    <div className="p_info text-slate-600 mb-6 space-y-2">
      <p className="flex items-center gap-2">
        <span className="font-medium text-slate-800">Vendor:</span>
        <span className="text-slate-600">{product?.Vendor || 'Vendor'}</span>
      </p>
      <p className="flex items-center gap-2">
        <span className="font-medium text-slate-800">Category:</span>
        <span className="text-slate-600">{product?.subcategory || 'General'}</span>
      </p>
    </div>


    <div className="sizes mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-3">Size</h3>
      <div className="flex gap-3 flex-wrap">
        {(product?.sizes || ['XS', 'M', 'L']).map((size, index) => (
          <span
            key={index}
            onClick={() => setSize(size)}
            className={`cursor-pointer px-4 py-2 border-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
              Size === size
                ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 text-white border-transparent shadow-lg'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800'
            }`}
          >
            {size.size}
          </span>
        ))}
      </div>
    </div>


    <div className="mb-8">
      <div className="text-2xl lg:text-3xl font-bold text-slate-800">
        <span className="text-lg lg:text-2xl text-slate-600">PKR</span> {product?.cut_price || '0'}
      </div>
    </div>

 
    <div className="order mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-3">Quantity</h3>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center bg-slate-100 rounded-md border border-slate-200 shadow-sm">
          <button 
            className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-all duration-300 rounded-l-md"
            onClick={() => Counter > 1 && setCounter(Counter - 1)}
          >
            −
          </button>
          <div className="px-6 py-2 border-l border-r border-slate-200 font-bold text-slate-800 bg-white">
            {Counter}
          </div>
          <button 
            className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-all duration-300 rounded-r-md"
            onClick={() => setCounter(Counter + 1)}
          >
            +
          </button>
        </div>
        
        <button
          onClick={handleAddWishlist}
          className="p-3 bg-slate-100 text-slate-800 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:text-white hover:scale-110 rounded-lg transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-lg"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

   
      <div className="flex gap-4">
        <button
          onClick={handleAddCart}
          disabled={!Size}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            !Size 
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-200' 
              : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 text-white shadow-md hover:shadow-2xl hover:brightness-105 hover:-translate-y-0.5 border-transparent'
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>

    <div className="buyNowBtn">
      <button
        onClick={handleBuyNow}
        disabled={!Size}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
          !Size 
            ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-200' 
            : 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-md hover:shadow-2xl hover:brightness-105 hover:-translate-y-0.5 border-transparent'
        }`}
      >
        Buy Now
      </button>
    </div>
  </div>
</div>

  )
}

export default ProdcutInfo