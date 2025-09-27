import { NextResponse } from "next/server";
import GlobalOrder from "@/models/GlobalOrder";
import Order from "@/models/Order";
import dbConnect from "@/Utils/connectDb";
import { AuthGuard } from "@/Utils/guards";


async function createOrderHandler(request) {
  const data = await request.json();
  try {
    await dbConnect();
    const { Info, Orders } = data;

    if (!Info || !Orders) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const userId = request.user.id;

    const count = await GlobalOrder.countDocuments();

    for (let index = 0; index < Orders.length; index++) {
      const orderId = `ORD-${String(count + 1 + index).padStart(5, "0")}`;
      const totalPrice = Orders[index].cut_price * Orders[index].quantity;

      const productData = {
        _id: Orders[index].id,
        title: Orders[index].title,
        size: Orders[index].size,
        vendor: Orders[index].vendor,
        price: Orders[index].price,
        quantity: Orders[index].quantity,
        cut_price: Orders[index].cut_price,
        main_image: Orders[index].image,
      };

      await Order.create({
        id: orderId,
        total: totalPrice,
        quantity: Orders[index].quantity,
        size: Orders[index].size,
        phone: Info.phone,
        userId,
        address: Info.address,
        product: productData,
      });

      await GlobalOrder.create({
        orderId,
        total: totalPrice,
        quantity: Orders[index].quantity,
        size: Orders[index].size,
        phone: Info.phone,
        userId, 
        address: Info.address,
        product: productData,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

export const POST = AuthGuard(createOrderHandler);

export const config = {
  runtime: "nodejs",
};
