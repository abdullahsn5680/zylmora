import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import GlobalOrder from '@/models/GlobalOrder';
import Order from '@/models/Order';
import { AdminGuard } from '@/Utils/guards';

async function getOrdersHandler(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    
    // Build query
    const query = {};
    
    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalOrders = await GlobalOrder.countDocuments(query);
    
    // Fetch paginated orders with populated product data
    const allOrders = await GlobalOrder.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('product')
      .lean();
    
    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);
    
    return NextResponse.json({
      success: true,
      orders: allOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching global orders:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching global orders' },
      { status: 500 }
    );
  }
}

async function updateOrderHandler(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, status, returnReason, cancelReason, address } = body;

    const globalOrder = await GlobalOrder.findById(id);
    if (!globalOrder) {
      return NextResponse.json(
        { success: false, message: 'Global order not found' },
        { status: 404 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (returnReason) updateData.returnReason = returnReason;
    if (cancelReason) updateData.cancelReason = cancelReason;
    if (address) updateData.address = address;

    // Update timestamp
    updateData.updatedAt = new Date();

    // Update both collections
    await GlobalOrder.findByIdAndUpdate(id, updateData);
    await Order.findOneAndUpdate({ id: globalOrder.orderId }, updateData);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating order' },
      { status: 500 }
    );
  }
}

export const GET = AdminGuard(getOrdersHandler);
export const PUT = AdminGuard(updateOrderHandler);

export const config = {
  runtime: 'nodejs',
};