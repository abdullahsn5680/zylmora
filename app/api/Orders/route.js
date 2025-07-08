
import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import Order from '@/models/Order';
import GlobalOrder from '@/models/GlobalOrder';

export const POST = async (request) => {
  try {
    await dbConnect();
    const data = await request.json();
    const detail = data.orderDetails;

    const count = await Order.countDocuments();
    const orderId = `ORD-${String(count + 1).padStart(5, '0')}`;
    const totalPrice = detail.product.cut_price * detail.quantity;

    const newOrder = await Order.create({
      id: orderId,
      total: totalPrice,
      quantity: detail.quantity,
      size: detail.size,
      phone: detail.phone,
      userId: detail.user._id,
      address: detail.address,
      product: detail.product,
    });

    await GlobalOrder.create({
      orderId,
      total: totalPrice,
      quantity: detail.quantity,
      size: detail.size,
      phone: detail.phone,
      userId: detail.user._id,
      address: detail.address,
      product: detail.product,
    });

    return NextResponse.json({ message: 'Order placed', success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Internal server error', success: false }, { status: 500 });
  }
};


export const GET = async (request) => {
  try {
    await dbConnect();
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'User ID required' }, { status: 400 });

    const orders = await Order.find({ userId });
    return NextResponse.json({ orders, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Failed to fetch orders', success: false }, { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    await dbConnect();
    const body = await request.json();

    const updateFields = {};
    if (body.status) updateFields.status = body.status;
    if (body.returnReason) updateFields.returnReason = body.returnReason;
    if (body.cancelReason) updateFields.cancelReason = body.cancelReason;
    if (body.address) updateFields.address = body.address;

    await Order.findOneAndUpdate({ id: body.id }, { $set: updateFields });

    return NextResponse.json({ message: 'Order updated', success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update order', success: false }, { status: 500 });
  }
};

export const DELETE = async (request) => {
  try {
    await dbConnect();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Order ID required' }, { status: 400 });

    await Order.findOneAndDelete({ id });
    return NextResponse.json({ message: 'Order deleted', success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to delete order', success: false }, { status: 500 });
  }
};
