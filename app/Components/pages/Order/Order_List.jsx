import { ArrowRight, Package, TrendingUp, ShoppingBag } from 'lucide-react';
import React from 'react';

function Order_List({
  selectedStatus,
  setSelectedOrder,
  setSelectedStatus,
  filteredOrders,
  setShowCancelReason,
  setShowNewAddressInput,
}) {
  const totalOrders = filteredOrders.length;
  const totalItems = filteredOrders.reduce((acc, o) => acc + (o.quantity || 0), 0);
  const totalSpent = filteredOrders.reduce((acc, o) => acc + (o.total || 0), 0);

  const getStatusColors = (status) => {
    const colors = {
      'Delivered': {
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        badge: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        glow: 'shadow-emerald-500/20',
      },
      'Shipped': {
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        badge: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        glow: 'shadow-blue-500/20',
      },
      'Processing': {
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        badge: 'bg-gradient-to-r from-amber-500 to-orange-500',
        glow: 'shadow-amber-500/20',
      },
      'Cancelled': {
        gradient: 'from-red-500 via-rose-500 to-pink-500',
        badge: 'bg-gradient-to-r from-red-500 to-rose-500',
        glow: 'shadow-red-500/20',
      },
      'Return Requested': {
        gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
        badge: 'bg-gradient-to-r from-purple-500 to-fuchsia-500',
        glow: 'shadow-purple-500/20',
      },
    };
    return colors[status] || {
      gradient: 'from-gray-500 via-slate-500 to-zinc-500',
      badge: 'bg-gradient-to-r from-gray-500 to-slate-500',
      glow: 'shadow-gray-500/20',
    };
  };

  return (
    <div className="min-h-screen px-1 py-4 sm:p-2 w-full lg:p-8">
     
      <button
        onClick={() => {
          setSelectedStatus(null);
          setSelectedOrder(null);
        }}
        className="group mb-8 flex items-center gap-3 px-2 py-3 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-x-2 border border-white/20 hover:border-purple-200/40"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <ArrowRight className="w-4 h-4 rotate-180 text-white" />
        </div>
        <span className="font-bold text-gray-800 text-sm sm:text-base tracking-wide">
          Back to Categories
        </span>
      </button>

   
      <div className="text-center mb-10">
        <div className="inline-block relative mb-6">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient mb-2">
            {selectedStatus}
          </h2>
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-2xl -z-10 animate-pulse" />
        </div>
        
        <div className="w-32 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full mb-8 shadow-lg" />

     
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 w-full mx-auto">
          <div className="group relative bg-white/90 backdrop-blur-2xl px-4 py-4 sm:py-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-1">Orders</p>
              <p className="text-xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {totalOrders}
              </p>
            </div>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-2xl px-4 py-4 sm:py-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-1">Items</p>
              <p className="text-xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {totalItems}
              </p>
            </div>
          </div>

          <div className="group hidden md:block relative bg-white/90 backdrop-blur-2xl px-4 py-4 sm:py-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-1">Total</p>
              <p className="text-lg sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                PKR {totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      
      {filteredOrders.length === 0 ? (
        <div className="relative text-center py-20 px-4 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5" />
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-gray-100 via-gray-50 to-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-gray-100">
              <span className="text-7xl sm:text-8xl">📦</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-800 mb-3">
              No Orders Found
            </h3>
            <p className="text-gray-500 text-base sm:text-xl leading-relaxed max-w-md mx-auto font-medium">
              You don&apos;t have any {selectedStatus.toLowerCase()} orders right now.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:gap-6">
          {filteredOrders.map((order, index) => {
            const statusColors = getStatusColors(order.status);
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedOrder(order);
                  setShowCancelReason(false);
                  setShowNewAddressInput(false);
                }}
                className="group relative w-full text-left bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-white/20"
                style={{ animationDelay: `${index * 50}ms` }}
              >
            
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${statusColors.gradient}`} />
                
              
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${statusColors.gradient} blur-3xl -z-10`} />

                <div className="flex items-center gap-4 sm:gap-6 py-3 px-5 sm:p-7">
               
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/50 group-hover:ring-white/80 transition-all duration-500">
                      <img
                        src={order.product?.main_image || ''}
                        alt={order.product?.title}
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                      />
                    </div>
                    
                    <div className={`absolute -top-2 -right-2 px-2 py-1.5 rounded-xl text-xs font-bold shadow-lg text-white ${statusColors.badge} ${statusColors.glow} group-hover:scale-110 transition-transform duration-300`}>
                      {order.status}
                    </div>
                  </div>

               
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-xl font-black text-gray-800 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 mb-2">
                      {order.product?.title}
                    </h3>

                    <p className="text-lg sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                      PKR {order.total.toLocaleString()}
                    </p>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <span className="px-3 py-1 hidden text-xs sm:text-sm font-bold text-gray-600 bg-gray-100/80 rounded-lg">
                        #{order.id}
                      </span>
                      <span className="px-3 py-1 text-xs sm:text-sm font-bold text-purple-600 bg-purple-100/80 rounded-lg">
                        Qty: {order.quantity}
                      </span>
                      {order.size && (
                        <span className="px-3 py-1 text-xs sm:text-sm font-bold text-pink-600 bg-pink-100/80 rounded-lg">
                          Size: {order.size}
                        </span>
                      )}
                    </div>
                  </div>

               
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Order_List;