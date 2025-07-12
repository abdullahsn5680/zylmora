'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Loader from '@/app/Components/Loader/loader';
import { UserContext } from '@/app/Context/contextProvider';

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
      const res = await fetch(`/api/Orders?userId=${session?.user?.id}`);
      const data = await res.json();
      setTimeout(() => setLoading(false), 1000);
      if (data.success) setOrders(data.orders);
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
    <div className="min-h-screen bg-gray-100 py-6 px-2 md:px-4">
      <div className="bg-white max-w-3xl mx-auto rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.back()}
            className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <h2 className="text-lg font-bold text-gray-800">My Orders</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {statusOptions.map((status, index) => (
            <button
              key={index}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full border text-xs font-medium ${
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
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order,index) => (
              <div className="border rounded p-3 flex items-center gap-3" key={index}>
                <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={order.product?.main_image || ''}
                    alt={order.product?.title || 'Product'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {order.product?.title}
                  </h3>
                  <p className="text-xs text-gray-500">Order #{order.id}</p>
                  <p className={`text-xs font-semibold mt-1 ${
                    order.status === 'Delivered' ? 'text-green-600'
                    : order.status === 'Shipped' ? 'text-blue-600'
                    : order.status === 'Processing' ? 'text-yellow-600'
                    : order.status === 'Cancelled' ? 'text-red-600'
                    : order.status === 'Return Requested' ? 'text-purple-600'
                    : 'text-gray-600'
                  }`}>
                    {order.status}
                  </p>
                  <p className="text-sm font-bold text-red-500">
                    PKR {(order.total).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowCancelReason(false);
                    setShowNewAddressInput(false);
                  }}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                >
                  Full Info
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-4 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>

            <h3 className="text-lg font-bold mb-2">{selectedOrder.product?.title}</h3>
            <div className="w-[100px] aspect-square mb-3 overflow-hidden rounded">
              <img
                src={selectedOrder.product?.main_image}
                alt={selectedOrder.product?.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-sm space-y-1 text-gray-700">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Qty:</strong> {selectedOrder.quantity}</p>
              <p><strong>Size:</strong> {selectedOrder.size}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Vendor:</strong> {selectedOrder.product?.Vendor}</p>
              <p><strong>Original:</strong> <s>PKR {selectedOrder.product?.price}</s></p>
              <p><strong>Discounted:</strong> PKR {selectedOrder.product?.cut_price}</p>
              <p><strong>Discount:</strong> {selectedOrder.product?.discount}%</p>
              <p><strong>Category:</strong> {selectedOrder.product?.category} / {selectedOrder.product?.subcategory}</p>
            </div>

                 {selectedOrder.status === 'Cancelled' && !selectedOrder.cancelReason && (
              <p className="mt-3 text-sm text-red-600">
                Cancelled by Zylmora
              </p>
            )}

            {selectedOrder.status === 'Cancelled' && selectedOrder.cancelReason && (
              <p className="mt-3 text-sm text-red-600">
                Cancelled by User
              </p>
            )}
            {selectedOrder.status === 'Cancelled' && selectedOrder.cancelReason && (
              <p className="mt-3 text-sm text-red-600">
                Reason: {selectedOrder.cancelReason}
              </p>
            )}
            {selectedOrder.status === 'Return Requested' && selectedOrder.returnReason && (
              <p className="mt-3 text-sm text-purple-600">
                Return Reason: {selectedOrder.returnReason}
              </p>
            )}



            <div className="mt-4 space-y-2">
              {selectedOrder.status === 'Delivered' && (
                <>
                  <input
                    type="text"
                    placeholder="Enter return reason"
                    className="w-full border rounded px-2 py-1 text-sm"
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, returnReasonInput: e.target.value })}
                  />
                  <button
                    className="w-full text-sm bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
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
                    Submit Return
                  </button>
                </>
              )}

              {selectedOrder.status === 'Processing' && !showCancelReason && (
                <button
                  className="w-full text-sm bg-orange-100 text-orange-800 px-3 py-2 rounded hover:bg-orange-200"
                  onClick={() => setShowCancelReason(true)}
                >
                  Cancel Order
                </button>
              )}

              {showCancelReason && (
                <>
                  <input
                    type="text"
                    placeholder="Enter cancel reason"
                    className="w-full border rounded px-2 py-1 text-sm"
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, cancelReasonInput: e.target.value })}
                  />
                  <button
                    className="w-full text-sm bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600"
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
                    Submit Cancel
                  </button>
                </>
              )}

              {selectedOrder.status === 'Processing' && !showNewAddressInput && (
                <button
                  className="w-full text-sm bg-blue-100 text-blue-800 px-3 py-2 rounded hover:bg-blue-200"
                  onClick={() => setShowNewAddressInput(true)}
                >
                  Change Address
                </button>
              )}

              {showNewAddressInput && (
                <>
                  <input
                    type="text"
                    placeholder="Enter new address"
                    className="w-full border rounded px-2 py-1 text-sm"
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, newAddressInput: e.target.value })}
                  />
                  <button
                    className="w-full text-sm bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
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
                    Save Address
                  </button>
                </>
              )}

              {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') && (
                <button
                  className="w-full text-sm bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
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
      )}
    </div>
  );
}
