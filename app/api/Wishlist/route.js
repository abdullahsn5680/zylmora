export const config = {
  runtime: 'nodejs',
};

import { NextResponse } from "next/server";
import users from "@/models/users";
import dbConnect from "@/Utils/connectDb";
import { AuthGuard } from "@/Utils/guards";




async function getWishlistHandler(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await users.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user.wishlist || [], { status: 200 });
}

async function addToWishlistHandler(req) {
  await dbConnect();
  const body = await req.json();
  const { email, product } = body;

  if (!email || !product) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const user = await users.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const wishlistItem = {
    id: product._id,
    title: product.title,
    category: product.category,
    subcategory: product.subcategory,
    vendor: product.Vendor,
    price: product.price,
    cut_price: product.cut_price,
    image: product.main_image,
  };


  user.wishlist = user.wishlist.filter(item => item.id !== product._id);


  user.wishlist.push(wishlistItem);
  await user.save();

  return NextResponse.json({ success: true, wishlist: user.wishlist }, { status: 200 });
}

async function removeFromWishlistHandler(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const productId = searchParams.get('productId');

  if (!email || !productId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const user = await users.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.wishlist = user.wishlist.filter(item => item.id !== productId);
  await user.save();

  return NextResponse.json({ success: true, wishlist: user.wishlist }, { status: 200 });
}


export const GET = AuthGuard(getWishlistHandler);
export const POST = AuthGuard(addToWishlistHandler);
export const DELETE = AuthGuard(removeFromWishlistHandler);
