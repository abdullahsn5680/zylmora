'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Package, TrendingUp, Truck, CheckCircle, XCircle, RotateCcw, Clock, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import { cacheFetch } from '@/Utils/cacheFetch';
import Order_List from '@/app/Components/pages/Order/Order_List';
import Orders_Detail from '@/app/Components/pages/Order/Orders_Detail';
import Orders_Catagories from '@/app/Components/pages/Order/Orders_Catagories';

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

   
    { !selectedOrder &&  <div className="relative z-1 max-w-7xl mx-auto px-3 md:px-6 py-16">
     
        {!selectedStatus && < Orders_Catagories  statusCategories={statusCategories} setSelectedStatus={setSelectedStatus} />
        }

     
        {selectedStatus&& !selectedOrder &&  <Order_List selectedStatus={selectedStatus} setSelectedOrder={setSelectedOrder}setSelectedStatus={setSelectedStatus} filteredOrders={filteredOrders}setShowCancelReason={setShowCancelReason}setShowNewAddressInput={setShowNewAddressInput}/>
        }
      </div>}

     
      {selectedOrder && <Orders_Detail selectedOrder={ selectedOrder} setSelectedOrder={setSelectedOrder} setShowCancelReason={setShowCancelReason}setShowNewAddressInput={setShowNewAddressInput}showCancelReason={showCancelReason}showNewAddressInput={showNewAddressInput}/>}

  
    </div>
  );
}