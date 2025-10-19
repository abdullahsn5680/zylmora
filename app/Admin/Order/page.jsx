'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import { Search, ChevronLeft, ChevronRight, Package, Truck, CheckCircle, XCircle, RefreshCw, Filter } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [pageSize] = useState(10);
  
  const router = useRouter();
  const { session, status } = useContext(UserContext);
  const isAdmin = session?.user?.role;

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.replace('/Authentication');
      }
      if (!isAdmin) {
        router.replace('/');
      }
    }
  }, [status]);

  const fetchGlobalOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        status: selectedStatus !== 'All' ? selectedStatus : '',
        search: searchQuery
      });

      const res = await fetch(`/api/globalOrders?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setTotalOrders(data.totalOrders);
      }
    } catch (err) {
      console.error('Error fetching global orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id, updateData) => {
    try {
      setUpdatingOrderId(id);
      const res = await fetch('/api/globalOrders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData }),
      });
      const data = await res.json();
      if (data.success) {
        fetchGlobalOrders();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchGlobalOrders();
  }, [currentPage, selectedStatus, searchQuery]);

  const statusOptions = [
    { name: 'All', icon: Filter, color: 'gray' },
    { name: 'Processing', icon: Package, color: 'yellow' },
    { name: 'Shipped', icon: Truck, color: 'blue' },
    { name: 'Delivered', icon: CheckCircle, color: 'green' },
    { name: 'Return Requested', icon: RefreshCw, color: 'purple' },
    { name: 'Cancelled', icon: XCircle, color: 'red' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'bg-green-100 text-green-700 border-green-300',
      'Cancelled': 'bg-red-100 text-red-700 border-red-300',
      'Return Requested': 'bg-purple-100 text-purple-700 border-purple-300',
      'Shipped': 'bg-blue-100 text-blue-700 border-blue-300',
      'Processing': 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 animate-pulse">
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-3 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => history.back()}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <div className="text-sm text-gray-600 font-medium">
              Total Orders: <span className="text-blue-600">{totalOrders}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Management</h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Order ID, User ID, Phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(({ name, icon: Icon, color }) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedStatus(name);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  selectedStatus === name
                    ? `bg-${color}-600 text-white border-${color}-600 shadow-md`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <Icon size={16} />
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {loading ? (
            <LoadingSkeleton />
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery ? 'Try adjusting your search' : `No ${selectedStatus.toLowerCase()} orders`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-5">
                    {/* Product Image */}
                    <div className="w-full lg:w-40 h-40 flex-shrink-0">
                      <img
                        src={order.product?.main_image || '/placeholder.png'}
                        alt={order.product?.title || 'Product'}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {order.product?.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              Order #{order.orderId}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              User: {order.userId}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Product Price:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            PKR {order.product?.cut_price?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <span className="ml-2 font-bold text-blue-600">
                            PKR {(order.quantity * order.product?.cut_price)?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-2 font-medium">{order.quantity}</span>
                          <span className="ml-3 text-gray-500">Size:</span>
                          <span className="ml-2 font-medium">{order.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <span className="ml-2 font-medium">{order.phone}</span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-500">Address:</span>
                        <p className="mt-1 text-gray-700">{order.address}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {order.status === 'Processing' && (
                          <>
                            <button
                              onClick={() => updateOrder(order._id, { status: 'Shipped' })}
                              disabled={updatingOrderId === order._id}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              <Truck size={16} />
                              Mark as Shipped
                            </button>
                            <button
                              onClick={() => updateOrder(order._id, { status: 'Cancelled' })}
                              disabled={updatingOrderId === order._id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              <XCircle size={16} />
                              Cancel Order
                            </button>
                          </>
                        )}

                        {order.status === 'Return Requested' && (
                          <>
                            <button
                              onClick={() => updateOrder(order._id, { status: 'Shipped' })}
                              disabled={updatingOrderId === order._id}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              <Truck size={16} />
                              Resend Order
                            </button>
                            <button
                              onClick={() => updateOrder(order._id, { status: 'Cancelled' })}
                              disabled={updatingOrderId === order._id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              <XCircle size={16} />
                              Cancel Order
                            </button>
                          </>
                        )}

                        {order.status === 'Shipped' && (
                          <button
                            onClick={() => updateOrder(order._id, { status: 'Delivered' })}
                            disabled={updatingOrderId === order._id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 text-sm font-medium"
                          >
                            <CheckCircle size={16} />
                            Mark as Delivered
                          </button>
                        )}
                      </div>

                      {/* Reasons */}
                      {order.returnReason && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
                          <span className="font-semibold text-purple-900">Return Reason:</span>
                          <p className="text-purple-700 mt-1">{order.returnReason}</p>
                        </div>
                      )}
                      {order.cancelReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                          <span className="font-semibold text-red-900">Cancel Reason:</span>
                          <p className="text-red-700 mt-1">{order.cancelReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && orders.length > 0 && (
            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalOrders)} of {totalOrders} orders
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}