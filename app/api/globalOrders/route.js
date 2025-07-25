export const config = {
  runtime: 'nodejs',
};

import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import GlobalOrder from '@/models/GlobalOrder';
import Order from '@/models/Order';
export const GET = async () => {
  try {
    await dbConnect();
    const allOrders = await GlobalOrder.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders: allOrders });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching global orders' }, { status: 500 });
  }
};


export const PUT = async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, status, returnReason, cancelReason, address } = body;

    const globalOrder = await GlobalOrder.findById(id);
    if (!globalOrder) {
      return NextResponse.json({ success: false, message: 'Global order not found' }, { status: 404 });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (returnReason) updateData.returnReason = returnReason;
    if (cancelReason) updateData.cancelReason = cancelReason;
    if (address) updateData.address = address;

    await GlobalOrder.findByIdAndUpdate(id, updateData);

  
    await Order.findOneAndUpdate({ id: globalOrder.orderId }, updateData);

    return NextResponse.json({ success: true, message: 'Order updated in both collections' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error updating order' }, { status: 500 });
  }
};
