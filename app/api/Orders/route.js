
import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import Order from '@/models/Order';
import GlobalOrder from '@/models/GlobalOrder';
import users from '@/models/users';
import { AuthGuard } from '@/Utils/guards';


export const config = { runtime: 'nodejs' };


async function getOrdersHandler(request) {
  try {
    await dbConnect();
    const userId = request.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ orders, success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch orders', success: false }, { status: 500 });
  }
}

async function placeOrderHandler(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const detail = data.orderDetails;

    if (!detail || !detail.product) {
      return NextResponse.json({ message: 'Order details are required', success: false }, { status: 400 });
    }

    const count = await GlobalOrder.countDocuments();
    const orderId = `ORD-${String(count + 1).padStart(5, '0')}`;
    const totalPrice = detail.product.cut_price * detail.quantity;


    await Order.create({
      id: orderId,
      total: totalPrice,
      quantity: detail.quantity,
      size: detail.size,
      phone: detail.phone,
      userId: request.user.id,
      address: detail.address,
      product: detail.product,
    });


    await GlobalOrder.create({
      orderId,
      total: totalPrice,
      quantity: detail.quantity,
      size: detail.size,
      phone: detail.phone,
      userId: request.user.id,
      address: detail.address,
      product: detail.product,
    });

 
    const user = await users.findById(request.user.id);
    if (user && user.cart) {
      user.cart = user.cart.filter(function(item) {
        return item.id !== detail.product._id;
      });
      await user.save();
    }

    return NextResponse.json({ message: 'Order placed and cart updated', success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', success: false }, { status: 500 });
  }
}

async function updateOrderHandler(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, status, returnReason, cancelReason, } = body;
    if (!id) return NextResponse.json({ message: 'Order ID required', success: false }, { status: 400 });
    const updateFields = {};
    if (status) updateFields.status = status;
    if (returnReason) updateFields.returnReason = returnReason;
    if (cancelReason) updateFields.cancelReason = cancelReason;
    // if (address) updateFields.address = address;

    await GlobalOrder.findOneAndUpdate({ orderId: id }, { $set: updateFields });
    await Order.findOneAndUpdate({ id }, { $set: updateFields });

    return NextResponse.json({ message: 'Order updated', success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update order', success: false }, { status: 500 });
  }
}

async function deleteOrderHandler(request) {
  try {
    await dbConnect();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Order ID required', success: false }, { status: 400 });

    await Order.findOneAndDelete({ id });
    

    return NextResponse.json({ message: 'Order deleted', success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete order', success: false }, { status: 500 });
  }
}



export const GET = AuthGuard(getOrdersHandler);
export const POST = AuthGuard(placeOrderHandler);
export const PUT = AuthGuard(updateOrderHandler);
export const DELETE = AuthGuard(deleteOrderHandler);
