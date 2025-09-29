'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Package, TrendingUp, Truck, CheckCircle, XCircle, RotateCcw, Clock, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import { cacheFetch } from '@/Utils/cacheFetch';

export default function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [showNewAddressInput, setShowNewAddressInput] = useState(false);

  const statusCategories = [
    {
      name: 'Processing',
      icon: <Clock className="w-8 h-8" />,
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      count: orders.filter(o => o.status === 'Processing').length
    },
    {
      name: 'Shipped',
      icon: <Truck className="w-8 h-8" />,
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      count: orders.filter(o => o.status === 'Shipped').length
    },
    {
      name: 'Delivered',
      icon: <CheckCircle className="w-8 h-8" />,
      gradient: 'from-emerald-400 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      count: orders.filter(o => o.status === 'Delivered').length
    },
    {
      name: 'Cancelled',
      icon: <XCircle className="w-8 h-8" />,
      gradient: 'from-red-400 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      count: orders.filter(o => o.status === 'Cancelled').length
    },
    {
      name: 'Return Requested',
      icon: <RotateCcw className="w-8 h-8" />,
      gradient: 'from-purple-400 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50',
      count: orders.filter(o => o.status === 'Return Requested').length
    },
    {
      name: 'All Orders',
      icon: <Package className="w-8 h-8" />,
      gradient: 'from-slate-400 to-gray-600',
      bgGradient: 'from-slate-50 to-gray-50',
      count: orders.length
    }
  ];
  const { session,status } = useContext(UserContext);
  const router = useRouter();
 
 useEffect(()=>{
    if(status !== "loading"){
     if(!session) router.replace('/Authentication')
    }
    
  },[status])
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




  const filteredOrders = selectedStatus === 'All Orders' || !selectedStatus
    ? orders
    : orders.filter(o => o.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
     
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-green-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}} />
      </div>

   
    {! selectedStatus&& <div className="relative z-1 bg-white/70 backdrop-blur-xl shadow-xl border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl mb-6 border border-gray-200/60 shadow-lg">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-600">Order Management</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-gray-800 mb-4 tracking-tight">
              Your Orders
            </h1>
            
            <p className="text-gray-600 text-lg font-light max-w-3xl mx-auto leading-relaxed">
              Track and manage all your orders in one place. View order status, update delivery details, and request returns.
            </p>
          </div>
        </div>
      </div>}

   
      <div className="relative z-1 max-w-7xl mx-auto px-6 py-16">
     
        {!selectedStatus && (
          <>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 tracking-tight">
                Browse by Status
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
            </div>

           
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8">
              {statusCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedStatus(category.name)}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-200/60"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                 
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-50`} />
                  
               
                  <div className="relative p-3 md:p-12">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        {category.icon}
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-5xl font-black bg-gradient-to-br ${category.gradient} bg-clip-text text-transparent`}>
                          {category.count}
                        </div>
                        <div className="text-sm text-gray-500 font-semibold">Orders</div>
                      </div>
                    </div>

               <h3
  className="text-2xl md:text-3xl font-black text-gray-800 mb-3 
             group-hover:text-blue-600 transition-colors duration-300
             truncate"
>
  {category.name}
</h3>
                    
                    <div className="text-gray-600  mb-6 leading-relaxed">
                      <span className='text-xs hidden md:flex md:text-xl'> View and manage all {category.name.toLowerCase()} orders in one place</span>
                     
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="group/btn hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300">
                        View Orders
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>

                
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${category.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-3xl`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl" />
                  
               
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                    <Eye className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

     
        {selectedStatus && (
          <> 
            <button
              onClick={() => {
                setSelectedStatus(null);
                setSelectedOrder(null);
              }}
              className="mb-8 flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-1 border border-gray-200/60"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              <span className="font-bold text-gray-700">Back to Categories</span>
            </button>

            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-800 mb-4">
                {selectedStatus}
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-24 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/60">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <span className="text-6xl opacity-60">📦</span>
                </div>
                <h3 className="text-3xl font-black text-gray-700 mb-4">No Orders Found</h3>
                <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                  You don't have any {selectedStatus.toLowerCase()} orders at the moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredOrders.map((order, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-gray-200/60"
                  >
                  
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${
                      order.status === 'Delivered' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                      order.status === 'Shipped' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                      order.status === 'Processing' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      order.status === 'Cancelled' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                      order.status === 'Return Requested' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                      'bg-gradient-to-r from-gray-400 to-gray-600'
                    }`}></div>

                    <div className="flex items-center gap-6 p-8">
                    
                      <div className="relative flex-shrink-0">
                        <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <img
                            src={order.product?.main_image || ''}
                            alt={order.product?.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        
                      
                        <div className={`absolute -top-2 -right-2 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg ${
                          order.status === 'Delivered' ? 'bg-emerald-500 text-white' :
                          order.status === 'Shipped' ? 'bg-blue-500 text-white' :
                          order.status === 'Processing' ? 'bg-yellow-500 text-white' :
                          order.status === 'Cancelled' ? 'bg-red-500 text-white' :
                          order.status === 'Return Requested' ? 'bg-purple-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            {order.status}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-3">
                        <h3 className="text-xl font-bold text-slate-800 truncate group-hover:text-slate-600 transition-colors duration-300">
                          {order.product?.title}
                        </h3>
                        
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-semibold">
                            Order #{order.id}
                          </span>
                          <span className="text-sm text-slate-500 font-semibold">
                            Qty: {order.quantity}
                          </span>
                          {order.size && (
                            <span className="text-sm text-slate-500 font-semibold">
                              Size: {order.size}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-emerald-600">
                              PKR {(order.total).toLocaleString()}
                            </p>
                            {order.product?.price !== order.product?.cut_price && (
                              <p className="text-sm text-slate-400">
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
                            className="bg-slate-100 group-hover:bg-slate-800 text-slate-600 group-hover:text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                  
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

     
      {selectedOrder && (
        <div className="fixed inset-0 z-99 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="relative overflow-hidden h-full rounded-3xl max-w-lg w-full">
            <div className="bg-white h-[90vh] overflow-y-auto">
             
              <div className="relative bg-gradient-to-r from-slate-600 to-slate-800 p-8">
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

             
              <div className="p-8 space-y-6">
                
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

                {/* Contact & Address */}
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

               
                <div className="space-y-3">
                  {selectedOrder.status === 'Delivered' && (
                    <>
                      <input
                        type="text"
                        placeholder="Enter return reason"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, returnReasonInput: e.target.value })}
                      />
                      <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
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
                      <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
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
                      <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Update Address
                      </button>
                    </>
                  )}

                  {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') && (
                    <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Delete Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

  
    </div>
  );
}