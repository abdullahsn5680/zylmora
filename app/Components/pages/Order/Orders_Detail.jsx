import React from 'react';
import { X, Package, MapPin, Phone, Tag, TrendingDown, Sparkles, CheckCircle, Clock, Truck, XCircle, RotateCcw, ShieldCheck, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Orders_Detail({selectedOrder, setSelectedOrder, setShowCancelReason, setShowNewAddressInput, showCancelReason, showNewAddressInput}) {
  const router =useRouter()
const handleCancelOrder = async () => {
  if (!selectedOrder.cancelReasonInput) {
    alert('Please provide a cancellation reason.');
    return;
  }

  try {
    const res = await fetch('/api/Orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedOrder.id,
        status: 'Cancelled',
        cancelReason: selectedOrder.cancelReasonInput,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Order cancelled successfully!');
      router.refresh(); // or trigger state refresh
      setSelectedOrder(null);
    } else {
      alert(data.message || 'Failed to cancel order');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
};

const handleReturnOrder = async () => {
  if (!selectedOrder.returnReasonInput) {
    alert('Please provide a return reason.');
    return;
  }

  try {
    const res = await fetch('/api/Orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedOrder.id,
        status: 'Return Requested',
        returnReason: selectedOrder.returnReasonInput,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Return request submitted!');
      router.refresh();
      setSelectedOrder(null);
    } else {
      alert(data.message || 'Failed to submit return');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
};

const handleDeleteOrder = async () => {
  if (!confirm('Are you sure you want to delete this order?')) return;
  try {
    const res = await fetch(`/api/Orders?id=${selectedOrder.id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (data.success) {
      alert('Order deleted successfully');
      router.refresh();
      setSelectedOrder(null);
    } else {
      alert(data.message || 'Failed to delete order');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
};




  const getStatusConfig = (status) => {
    const configs = {
      'Delivered': { 
        color: 'from-emerald-500 to-green-600', 
        bg: 'from-emerald-50 to-green-50',
        icon: CheckCircle,
        text: 'text-emerald-700'
      },
      'Shipped': { 
        color: 'from-blue-500 to-cyan-600', 
        bg: 'from-blue-50 to-cyan-50',
        icon: Truck,
        text: 'text-blue-700'
      },
      'Processing': { 
        color: 'from-amber-500 to-orange-600', 
        bg: 'from-amber-50 to-orange-50',
        icon: Clock,
        text: 'text-amber-700'
      },
      'Cancelled': { 
        color: 'from-red-500 to-rose-600', 
        bg: 'from-red-50 to-rose-50',
        icon: XCircle,
        text: 'text-red-700'
      },
      'Return Requested': { 
        color: 'from-purple-500 to-violet-600', 
        bg: 'from-purple-50 to-violet-50',
        icon: RotateCcw,
        text: 'text-purple-700'
      }
    };
    return configs[status] || configs['Processing'];
  };

  const statusConfig = getStatusConfig(selectedOrder.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="">
  
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>

    
      <div className="relative w-full  flex flex-col  pb-20">
        
       
        <div className="relative overflow-hidden ">
       
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
          
        
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
          </div>

    
          <div className="absolute top-4 right-20 w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="absolute top-8 right-32 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-6 right-40 w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse" style={{animationDelay: '2s'}} />

          <div className="relative p-4  md:px-8 h-[68vh] flex flex-col justify-center">
          
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 hover:rotate-90 transition-all duration-300 shadow-xl group z-1
              "
            >
              <X className="w-6 h-6 transition-transform duration-300" />
            </button>
            
        
            <div className="flex items-start gap-6">
            
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/40 group-hover:scale-105 group-hover:ring-white/60 transition-all duration-300">
                  <img
                    src={selectedOrder.product?.main_image}
                    alt={selectedOrder.product?.title}
                    className="w-full h-full object-cover"
                  />
              
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
              
             
              <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
  <Sparkles className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1 animate-pulse" />
  <h3
    className="text-[2rem] md:text-3xl font-black text-white leading-tight drop-shadow-lg 
               truncate max-w-[200px] md:max-w-[400px] overflow-hidden whitespace-nowrap"
  >
    {selectedOrder.product?.title}
  </h3>
</div>
                
                <div className="flex items-center flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                    <Package className="w-4 h-4 text-white" />
                    <p className="md:text-sm text-[10px] font-bold text-white">Order #{selectedOrder.id}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <p className="md:text-sm text-xs font-bold text-white">Verified Purchase</p>
                  </div>
                </div>
                
              
                
              </div>
              
            </div>
     <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
  
  <div className="inline-flex w-full items-center gap-3 mt-5 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border-2 border-white/50">
    <StatusIcon className={`w-6 h-6 ${statusConfig.text}`} />
    <div>
      <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Status</div>
      <div className={`text-lg font-black ${statusConfig.text}`}>{selectedOrder.status}</div>
    </div>
  </div>


  <button
    onClick={() => router.push(`/products/?url=${selectedOrder.product?._id}`)}
    className="inline-flex w-full items-center gap-3 mt-5 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border-2 border-white/50 hover:bg-white transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-blue-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12C3.75 7.5 8.25 4.5 12 4.5s8.25 3 9.75 7.5c-1.5 4.5-6 7.5-9.75 7.5s-8.25-3-9.75-7.5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
    <div>
      <div className="text-xs text-start font-bold text-gray-600 uppercase tracking-wider">Action</div>
      <div className="text-lg font-black text-blue-600">View Product</div>
    </div>
  </button>
</div>

          </div>

          
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
        </div>

       
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-50">
          <div className="p-8 space-y-8">
            
           
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                <h4 className="text-2xl font-black text-gray-900">Order Information</h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
             
                <div className="space-y-4">
                  <div className="group bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-wider mb-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${statusConfig.color} animate-pulse`} />
                      Order Status
                    </label>
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`w-7 h-7 ${statusConfig.text}`} />
                      <p className={`text-xl font-black ${statusConfig.text}`}>
                        {selectedOrder.status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                    <label className="flex items-center gap-2 text-xs font-black text-blue-700 uppercase tracking-wider mb-3">
                      <Package className="w-4 h-4" />
                      Quantity Ordered
                    </label>
                    <p className="text-2xl font-black text-slate-900">{selectedOrder.quantity} items</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                    <label className="text-xs font-black text-purple-700 uppercase tracking-wider mb-3 block">Product Size</label>
                    <p className="text-2xl font-black text-slate-900">{selectedOrder.size}</p>
                  </div>
                </div>
                
               
                <div className="space-y-4">
                  <div className="group bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-300 hover:border-emerald-400 hover:shadow-xl transition-all duration-300">
                    <label className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-3 block">Total Amount</label>
                    <p className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      PKR {selectedOrder.total.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                    <label className="text-xs font-black text-orange-700 uppercase tracking-wider mb-3 block">Vendor</label>
                    <p className="text-xl font-black text-slate-900">{selectedOrder.product?.Vendor}</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
                    <label className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-3 block">Category</label>
                    <p className="text-xl font-black text-slate-900">{selectedOrder.product?.category}</p>
                  </div>
                </div>
              </div>
            </div>

            
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                <h4 className="text-2xl font-black text-gray-900">Contact & Delivery</h4>
              </div>

              <div className="space-y-4">
                <div className="group bg-white rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                  <label className="flex items-center gap-3 text-sm font-black text-blue-700 uppercase tracking-wider mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    Contact Number
                  </label>
                  <p className="text-xl font-bold text-slate-900 ml-13">{selectedOrder.phone}</p>
                </div>
                
                <div className="group bg-white rounded-2xl p-6 border-2 border-rose-200 hover:border-rose-300 hover:shadow-xl transition-all duration-300">
                  <label className="flex items-center gap-3 text-sm font-black text-rose-700 uppercase tracking-wider mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    Delivery Address
                  </label>
                  <p className="text-base font-medium text-slate-700 leading-relaxed ml-13">{selectedOrder.address}</p>
                </div>
              </div>
            </div>

           
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                <h4 className="text-2xl font-black text-gray-900">Price Breakdown</h4>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl" />
                
                <div className="relative space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-white uppercase tracking-wider">Pricing Details</h4>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-slate-700">
                    <span className="text-base text-slate-300 font-medium">Original Price</span>
                    <span className="text-lg text-slate-400 line-through font-bold">PKR {selectedOrder.product?.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-slate-700">
                    <span className="text-base text-slate-300 font-medium">Discounted Price</span>
                    <span className="text-xl font-black text-white">PKR {selectedOrder.product?.cut_price}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl px-4">
                    <span className="text-base text-emerald-300 font-bold">Total Savings</span>
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-6 h-6 text-emerald-400" />
                      <span className="text-2xl font-black text-emerald-400">{selectedOrder.product?.discount}% OFF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        
            <div className="space-y-4 pt-4">
              {selectedOrder.status === 'Delivered' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Please enter your return reason..."
                    className="w-full border-2 border-gray-300 rounded-2xl px-6 py-4 text-base font-medium focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all duration-300 placeholder:text-gray-400 bg-white"
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, returnReasonInput: e.target.value })}
                    
                  />
               <button
  className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-8 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
  onClick={handleReturnOrder}
>
  <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
  Submit Return Request
</button>

                </div>
              )}

              {selectedOrder.status === 'Processing' && !showCancelReason && (
                <button
                  className="w-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-900 px-8 py-5 rounded-2xl font-black text-lg hover:from-orange-200 hover:to-red-200 hover:shadow-xl transition-all duration-300 border-2 border-orange-400 flex items-center justify-center gap-3 group"
                  onClick={() => setShowCancelReason(true)}
                >
                  <XCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  Cancel Order
                </button>
              )}

              {showCancelReason && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Please tell us why you're cancelling..."
                    className="w-full border-2 border-gray-300 rounded-2xl px-6 py-4 text-base font-medium focus:ring-4 focus:ring-red-500/30 focus:border-red-500 transition-all duration-300 placeholder:text-gray-400 bg-white"
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, cancelReasonInput: e.target.value })}
                    onClick={()=>{console.log('ads asd asd ')}}
                  />
                <button
  className="w-full bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
  onClick={handleCancelOrder}
>
  <XCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
  Confirm Cancellation
</button>

                </div>
              )}

              {/* {selectedOrder.status === 'Processing' && !showNewAddressInput && (
                <button
                  className="w-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 px-8 py-5 rounded-2xl font-black text-lg hover:from-blue-200 hover:to-cyan-200 hover:shadow-xl transition-all duration-300 border-2 border-blue-400 flex items-center justify-center gap-3 group"
                  onClick={() => setShowNewAddressInput(true)}
                >
                  <MapPin className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Change Delivery Address
                </button>
              )} */}

              {showNewAddressInput && (
                <div className="space-y-4">
                  <textarea
                    placeholder="Enter your new delivery address..."
                    rows="4"
                    className="w-full border-2 border-gray-300 rounded-2xl px-6 py-4 text-base font-medium focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 resize-none placeholder:text-gray-400 bg-white"
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, newAddressInput: e.target.value })}
                  />
                  <button className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                    <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    Update Address
                  </button>
                </div>
              )}

              {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') && (
               <button
  className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-slate-900 text-white px-8 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
  onClick={handleDeleteOrder}
>
  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
  Delete Order
</button>

              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders_Detail;