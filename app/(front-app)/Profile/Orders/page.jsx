'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Loader from '@/app/Components/Loader/loader';
import { UserContext } from '@/app/Context/contextProvider';
import { cacheFetch } from '@/Utils/cacheFetch';
export default function OrdersPage() {
  const { session } = useContext(UserContext);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [showNewAddressInput, setShowNewAddressInput] = useState(false);

  useEffect(() => {
    if (!session) router.replace('/Authentication');
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await cacheFetch(`/api/Orders?userId=${session?.user?.id}`);
      const data = res
      setTimeout(() => setLoading(false), 1000);
      if (data) {
        console.log(data)
        setOrders(data.orders);}
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchOrders();
  }, [session]);

  const statusOptions = [
    'All',
    'Processing',
    'Shipped',
    'Delivered',
    'Return Requested',
    'Cancelled',
  ];

  const filteredOrders =
    selectedStatus === 'All'
      ? orders
      : orders.filter((o) => o.status === selectedStatus);

  if (loading) return <Loader />;

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
 
  
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
            <span className="text-lg sm:text-xl md:text-2xl">📦</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
            Your Orders
          </h1>
        </div>
      </div>
    </div>
  </div>
  <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
  
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12">
      {statusOptions.map((status, index) => (
        <button
          key={index}
          onClick={() => setSelectedStatus(status)}
          className={`group relative px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
            selectedStatus === status
              ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-slate-400/30'
              : 'bg-white/80 backdrop-blur-sm text-slate-600 border border-gray-200 hover:bg-slate-50 hover:shadow-xl'
          }`}
        >
          <div className={`absolute top-0 left-0 h-0.5 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 transform transition-transform duration-300 rounded-t-xl sm:rounded-t-2xl ${
            selectedStatus === status ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`}></div>
          {status}
        </button>
      ))}
    </div>

   
    {filteredOrders.length === 0 ? (
      <div className="text-center py-24">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-7 md:mb-8 shadow-inner">
          <span className="text-4xl sm:text-5xl md:text-6xl opacity-60">🧾</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-700 mb-3 sm:mb-4">No Orders Found</h2>
        <p className="text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed max-w-sm sm:max-w-md mx-auto px-4">
          You haven't placed any orders yet. Start shopping now to see your orders here!
        </p>
      </div>
    ) : (
      <div className="grid gap-4 sm:gap-5 md:gap-6">
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border border-gray-100"
          >
         
            <div className={`absolute top-0 left-0 w-full h-1 sm:h-1.5 ${
              order.status === 'Delivered' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
              order.status === 'Shipped' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
              order.status === 'Processing' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              order.status === 'Cancelled' ? 'bg-gradient-to-r from-red-400 to-red-600' :
              order.status === 'Return Requested' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
              'bg-gradient-to-r from-gray-400 to-gray-600'
            }`}></div>

            <div className="flex items-center gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 lg:p-8">
             
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={order.product?.main_image || ''}
                    alt={order.product?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml;base64,${btoa(
                        `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f1f5f9"/>
                          <text x="50%" y="50%" font-family="system-ui" font-size="48" fill="#94a3b8" text-anchor="middle" dy=".3em">📦</text>
                        </svg>`
                      )}`;
                    }}
                  />
                </div>
                
            
                <div className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold shadow-lg ${
                  order.status === 'Delivered' ? 'bg-emerald-500 text-white' :
                  order.status === 'Shipped' ? 'bg-blue-500 text-white' :
                  order.status === 'Processing' ? 'bg-yellow-500 text-white' :
                  order.status === 'Cancelled' ? 'bg-red-500 text-white' :
                  order.status === 'Return Requested' ? 'bg-purple-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span className="hidden sm:inline">{order.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800 truncate group-hover:text-slate-600 transition-colors duration-300">
                  {order.product?.title}
                </h3>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                    Order #{order.id}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500">
                    Qty: {order.quantity}
                  </span>
                  {order.size && (
                    <span className="text-xs sm:text-sm text-slate-500">
                      Size: {order.size}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
                      PKR {(order.total).toLocaleString()}
                    </p>
                    {order.product?.price !== order.product?.cut_price && (
                      <p className="text-xs sm:text-sm text-slate-400">
                        <span className="line-through">PKR {order.product?.price}</span>
                        <span className="ml-2 text-red-500 font-semibold">{order.product?.discount}% off</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowCancelReason(false);
                      setShowNewAddressInput(false);
                    }}
                    className="bg-slate-100 group-hover:bg-slate-800 text-slate-600 group-hover:text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

          
            <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
        ))}
      </div>
    )}
  </div>

  
  {selectedOrder && (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white max-w-lg w-full rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden">
       
        <div className="relative bg-gradient-to-r from-slate-600 to-slate-800 p-6 sm:p-8">
          <button
            onClick={() => setSelectedOrder(null)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={selectedOrder.product?.main_image}
                alt={selectedOrder.product?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{selectedOrder.product?.title}</h3>
              <p className="text-slate-200 text-sm">Order #{selectedOrder.id}</p>
            </div>
          </div>
        </div>

     
        <div className="p-6 sm:p-8 space-y-6">
        
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                <p className={`text-sm font-bold ${
                  selectedOrder.status === 'Delivered' ? 'text-emerald-600' :
                  selectedOrder.status === 'Shipped' ? 'text-blue-600' :
                  selectedOrder.status === 'Processing' ? 'text-yellow-600' :
                  selectedOrder.status === 'Cancelled' ? 'text-red-600' :
                  selectedOrder.status === 'Return Requested' ? 'text-purple-600' :
                  'text-gray-600'
                }`}>
                  {selectedOrder.status}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity</label>
                <p className="text-sm font-medium text-slate-800">{selectedOrder.quantity}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Size</label>
                <p className="text-sm font-medium text-slate-800">{selectedOrder.size}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</label>
                <p className="text-lg font-bold text-emerald-600">PKR {selectedOrder.total.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vendor</label>
                <p className="text-sm font-medium text-slate-800">{selectedOrder.product?.Vendor}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
                <p className="text-sm font-medium text-slate-800">{selectedOrder.product?.category}</p>
              </div>
            </div>
          </div>

       
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</label>
              <p className="text-sm font-medium text-slate-800">{selectedOrder.phone}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Delivery Address</label>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">{selectedOrder.address}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Original Price</span>
              <span className="text-sm text-slate-500 line-through">PKR {selectedOrder.product?.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Discounted Price</span>
              <span className="text-sm font-semibold text-slate-800">PKR {selectedOrder.product?.cut_price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Discount</span>
              <span className="text-sm font-semibold text-emerald-600">{selectedOrder.product?.discount}%</span>
            </div>
          </div>

        
          {selectedOrder.status === 'Cancelled' && selectedOrder.cancelReason && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-red-800 mb-1">Cancelled by User</p>
              <p className="text-sm text-red-600">Reason: {selectedOrder.cancelReason}</p>
            </div>
          )}

          {selectedOrder.status === 'Return Requested' && selectedOrder.returnReason && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-purple-800 mb-1">Return Request</p>
              <p className="text-sm text-purple-600">Reason: {selectedOrder.returnReason}</p>
            </div>
          )}

          <div className="space-y-3">
            {selectedOrder.status === 'Delivered' && (
              <>
                <input
                  type="text"
                  placeholder="Enter return reason"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, returnReasonInput: e.target.value })}
                />
                <button
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={async () => {
                    const res = await fetch('/api/Orders', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: selectedOrder.id, status: 'Return Requested', returnReason: selectedOrder.returnReasonInput }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      fetchOrders();
                      setSelectedOrder(null);
                    }
                  }}
                >
                  Submit Return Request
                </button>
              </>
            )}

            {selectedOrder.status === 'Processing' && !showCancelReason && (
              <button
                className="w-full bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-4 py-3 rounded-xl font-semibold hover:from-orange-200 hover:to-orange-300 transition-all duration-300 border border-orange-300"
                onClick={() => setShowCancelReason(true)}
              >
                Cancel Order
              </button>
            )}

            {showCancelReason && (
              <>
                <input
                  type="text"
                  placeholder="Enter cancellation reason"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, cancelReasonInput: e.target.value })}
                />
                <button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={async () => {
                    const res = await fetch('/api/Orders', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: selectedOrder.id, status: 'Cancelled', cancelReason: selectedOrder.cancelReasonInput }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      fetchOrders();
                      setSelectedOrder(null);
                    }
                  }}
                >
                  Confirm Cancellation
                </button>
              </>
            )}

            {selectedOrder.status === 'Processing' && !showNewAddressInput && (
              <button
                className="w-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-3 rounded-xl font-semibold hover:from-blue-200 hover:to-blue-300 transition-all duration-300 border border-blue-300"
                onClick={() => setShowNewAddressInput(true)}
              >
                Change Delivery Address
              </button>
            )}

            {showNewAddressInput && (
              <>
                <textarea
                  placeholder="Enter new delivery address"
                  rows="3"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, newAddressInput: e.target.value })}
                />
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={async () => {
                    const res = await fetch('/api/Orders', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: selectedOrder.id, address: selectedOrder.newAddressInput }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      fetchOrders();
                      setSelectedOrder(null);
                    }
                  }}
                >
                  Update Address
                </button>
              </>
            )}

            {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') && (
              <button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={async () => {
                  const res = await fetch(`/api/Orders?id=${selectedOrder.id}`, { method: 'DELETE' });
                  const data = await res.json();
                  if (data.success) {
                    fetchOrders();
                    setSelectedOrder(null);
                  }
                }}
              >
                Delete Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
