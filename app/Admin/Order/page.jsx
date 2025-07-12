'use client';

import { useEffect, useState,useContext } from 'react';
import { useRouter } from 'next/navigation';
  import { UserContext } from '@/app/Context/contextProvider';
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
 const router =useRouter()
  const  {session}=useContext(UserContext)
const isAdmin = session?.user?.role 
 useEffect(()=>{
    if(!session){
      router.replace('/Authentication')
    }
     if(!isAdmin){
      router.replace('/')
    }
  },[])
  const fetchGlobalOrders = async () => {
    try {
      const res = await fetch('/api/globalOrders');
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error('Error fetching global orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id, updateData) => {
    try {
      const res = await fetch('/api/globalOrders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData }),
      });
      const data = await res.json();
      if (data.success) fetchGlobalOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  useEffect(() => {
    fetchGlobalOrders();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-2 md:px-4 flex justify-center">
      
      <div className="bg-white w-full max-w-5xl rounded-xl shadow p-4 md:p-6">
        <div className="mb-4">
  <button
    onClick={() => history.back()}
    className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
  >
    ← Back
  </button>
</div>

        <h2 className="text-2xl font-bold mb-4 text-center">Admin: Manage All Orders</h2>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 justify-center">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full border text-xs md:text-sm font-medium ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found for "{selectedStatus}".</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="border rounded-md p-4 flex flex-col sm:flex-row gap-4"
              >
                <div className="w-full sm:w-40 h-40">
                  <img
                    src={order.product?.main_image || ''}
                    alt={order.product?.title || 'Product'}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">{order.product?.title}</h3>
                  <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-500">User ID: {order.userId}</p>

                  <p className="text-sm">
                    Product Price: <span className="text-gray-800 font-medium">PKR {order.product?.cut_price}</span>
                  </p>
                  <p className="text-sm">
                    Total Order Price: <span className="text-blue-700 font-bold">PKR {order.quantity * order.product?.cut_price}</span>
                  </p>

                  <p className="text-sm">Quantity: {order.quantity} | Size: {order.size}</p>
                  <p className="text-sm">Phone: {order.phone}</p>
                  <p className="text-sm break-words">Address: {order.address}</p>

                  <p className={`font-medium ${
                    order.status === 'Delivered' ? 'text-green-600' :
                    order.status === 'Cancelled' ? 'text-red-600' :
                    order.status === 'Return Requested' ? 'text-purple-600' :
                    order.status === 'Shipped' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    Status: {order.status}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                  
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => updateOrder(order._id, { status: 'Shipped' })}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        Mark as Shipped
                      </button>
                    )}

                {order.status === 'Return Requested' && (
                      <button
                        onClick={() => updateOrder(order._id, { status: 'Shipped' })}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        Mark as Shipped
                      </button>
                    )}

                    {order.status === 'Shipped' && (
                      <button
                        onClick={() => updateOrder(order._id, { status: 'Delivered' })}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                      >
                        Mark as Delivered
                      </button>
                    )}

              
                    {order.status === 'Processing'  &&(
                      <button
                        onClick={() => updateOrder(order._id, { status: 'Cancelled' })}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Cancel Order
                      </button>
                    )}
                        {order.status === 'Return Requested'  &&(
                      <button
                        onClick={() => updateOrder(order._id, { status: 'Cancelled' })}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Cancel Order
                      </button>
                    )}

                    
                  </div>

                  {order.returnReason && (
                    <p className="text-xs text-purple-700 mt-1">Return Reason: {order.returnReason}</p>
                  )}
                  {order.cancelReason && (
                    <p className="text-xs text-red-700 mt-1">Cancel Reason: {order.cancelReason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
