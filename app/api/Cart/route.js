import { NextResponse } from "next/server";
import dbConnect from "@/Utils/connectDb";
import users from "@/models/users";
export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const user = await users.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user.cart || []);
}
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { size, quantity, product, email } = body;

  if (!size || !quantity || !product || !email) {
    return NextResponse.json({ error: "All data are required" }, { status: 400 });
  }

  const user = await users.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const cartItem = {
    id: product._id,
    title: product.title,
    size: size,
    vendor: product.Vendor,
    price: product.price,
    quantity: quantity,
    cut_price: product.cut_price,
    image: product.main_image,
  };

  user.cart = user.cart.filter((item) => item.id !== product._id);

  
  user.cart.push(cartItem);
  await user.save();

  return NextResponse.json({ success: true, cart: user.cart });
}


export async function DELETE(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const productId = searchParams.get('productId');

  if (!email || !productId) {
    return NextResponse.json({ error: "Email and productId are required" }, { status: 400 });
  }

  const user = await users.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.cart = user.cart.filter((item) => item.id !== productId);
  await user.save();

  return NextResponse.json({ success: true, cart: user.cart });
}
