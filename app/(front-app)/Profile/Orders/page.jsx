'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loader from '@/app/Components/Loader/loader';
export default function OrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading,setLoading]=useState(true)
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [returnReason, setReturnReason] = useState('');
  const [activeReturnOrderId, setActiveReturnOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [activeCancelOrderId, setActiveCancelOrderId] = useState(null);
  const [editAddressOrderId, setEditAddressOrderId] = useState(null);
  const [newAddress, setNewAddress] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/Orders?userId=${session?.user?.id}`);
      const data = await res.json();
      setTimeout(() => {
            setLoading(false)
        }, 1000);
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchOrders();
  }, [session]);

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/Orders?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
      setTimeout(() => {
            setLoading(false)
        }, 100);
  };

  const handleReturnSubmit = async (id) => {
    try {
      setLoading(true)
      const res = await fetch('/api/Orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Return Requested', returnReason }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        setReturnReason('');
        setActiveReturnOrderId(null);
      }
    } catch (err) {
      console.error('Error returning order:', err);
    }
      setTimeout(() => {
            setLoading(false)
        }, 100);
  };

  const handleCancelSubmit = async (id) => {
    try {
      setLoading(true)
      const res = await fetch('/api/Orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Cancelled', cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        setCancelReason('');
        setActiveCancelOrderId(null);
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
      setTimeout(() => {
            setLoading(false)
        }, 100);
  };

  const handleAddressChange = async (id) => {
    try {
      setLoading(true)
      const res = await fetch('/api/Orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, address: newAddress }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        setEditAddressOrderId(null);
        setNewAddress('');
      }
    } catch (err) {
      console.error('Error updating address:', err);
    }
    setTimeout(() => {
            setLoading(false)
        }, 100);
  };

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
if(loading) return <Loader/>
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-2 md:px-4 flex justify-center overflow-x-hidden">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            ← Back
          </button>

          <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
            My Orders
          </h2>

          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Refresh Orders
          </button>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 justify-center md:justify-start">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full border text-xs md:text-sm font-medium ${
                selectedStatus === status
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found for "{selectedStatus}".</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-md p-4 flex flex-col sm:flex-row gap-4"
              >
                <div className="w-full sm:w-40 h-40 flex-shrink-0">
                  <img
                    src={
                      order.product?.main_image ||
                      'https://via.placeholder.com/150?text=No+Image'
                    }
                    alt={order.product?.title || 'Product image'}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800">
                        {order.product?.title}
                      </h3>
                      <p className="text-xs text-gray-500">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">Date: {order.createdAt?.slice(0, 10)}</p>
                      <p className="text-xs text-gray-500">Quantity: {order.quantity}</p>
                      <p className="text-xs text-gray-500">Size: {order.size}</p>
                      <p className="text-xs text-gray-500">Phone: {order.phone}</p>
                      <p className="text-xs text-gray-500 break-words">Address: {order.address}</p>

                      {order.status === 'Processing' && editAddressOrderId === order.id && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Enter new address"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="w-full border rounded p-2 text-xs"
                          />
                          <button
                            onClick={() => handleAddressChange(order.id)}
                            className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Save Address
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-y-1 text-right w-full sm:w-auto">
                      <p className={`text-sm font-semibold ${
                        order.status === 'Delivered' ? 'text-green-600'
                        : order.status === 'Shipped' ? 'text-blue-600'
                        : order.status === 'Processing' ? 'text-yellow-600'
                        : order.status === 'Return Requested' ? 'text-purple-600'
                        : order.status === 'Cancelled' ? 'text-red-600'
                        : ''
                      }`}>
                        {order.status}
                      </p>
                      <p className="text-md font-bold text-red-500">
                        PKR {(order.total).toLocaleString()}
                      </p>

                      <div className="flex flex-wrap gap-x-2 gap-y-1 justify-end">
                        {order.status === 'Delivered' && (
                          <>
                            <button
                              onClick={() => setActiveReturnOrderId(order.id)}
                              className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200"
                            >
                              Return Order
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {activeReturnOrderId === order.id && (
                          <div className="w-full">
                            <input
                              type="text"
                              placeholder="Enter return reason"
                              value={returnReason}
                              onChange={(e) => setReturnReason(e.target.value)}
                              className="w-full border rounded p-2 mb-2 text-xs"
                            />
                            <button
                              onClick={() => handleReturnSubmit(order.id)}
                              className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 w-full"
                            >
                              Submit Return
                            </button>
                          </div>
                        )}

                        {order.status === 'Return Requested' && order.returnReason && (
                          <p className="text-xs text-purple-600 mt-2">
                            Reason: {order.returnReason}
                          </p>
                        )}

                        {order.status === 'Processing' && (
                          <>
                            <button
                              onClick={() => setEditAddressOrderId(order.id)}
                              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                            >
                              Change Address
                            </button>
                            <button
                              onClick={() => setActiveCancelOrderId(order.id)}
                              className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded hover:bg-orange-200"
                            >
                              Cancel Order
                            </button>
                          </>
                        )}

                        {activeCancelOrderId === order.id && (
                          <div className="w-full">
                            <input
                              type="text"
                              placeholder="Enter cancel reason"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="w-full border rounded p-2 mb-2 text-xs"
                            />
                            <button
                              onClick={() => handleCancelSubmit(order.id)}
                              className="text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 w-full"
                            >
                              Submit Cancel
                            </button>
                          </div>
                        )}

                        {order.status === 'Cancelled' && order.cancelReason && (
                          <p className="text-xs text-red-600 mt-2">
                            Cancelled: {order.cancelReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-700">
                    <p>
                      Original Price:{' '}
                      <span className="line-through text-gray-400">
                        PKR {order.product?.price}
                      </span>
                    </p>
                    <p>
                      Discounted Price:{' '}
                      <span className="font-medium">
                        PKR {order.product?.cut_price}
                      </span>
                    </p>
                    <p>Discount: {order.product?.discount}%</p>
                    <p>Vendor: {order.product?.Vendor}</p>
                    <p>
                      Category: {order.product?.category} / {order.product?.subcategory}
                    </p>
                  </div>

                  <div className="text-xs text-gray-600 mt-2">
                  
   
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
