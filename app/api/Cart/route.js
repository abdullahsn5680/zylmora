import { NextResponse } from "next/server";
import dbConnect from "@/Utils/connectDb";
import users from "@/models/users";
import { AuthGuard } from "@/Utils/guards";


async function getHandler(req) {
  await dbConnect();

  const email = req.user.email;

  const user = await users.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user.cart || []);
}
export const GET = AuthGuard(getHandler);


async function postHandler(req) {
  await dbConnect();

  const body = await req.json();
  const { size, quantity, product } = body;
  const email = req.user.email;

  if (!size || !quantity || !product) {
    return NextResponse.json({ error: "All data are required" }, { status: 400 });
  }

  const user = await users.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const cartItem = {
    id: product._id,
    title: product.title,
    size,
    vendor: product.Vendor,
    price: product.price,
    quantity,
    cut_price: product.cut_price,
    image: product.main_image,
  };

 
  user.cart = user.cart.filter((item) => item.id !== product._id);
  user.cart.push(cartItem);
  await user.save();

  return NextResponse.json({ success: true, cart: user.cart });
}
export const POST = AuthGuard(postHandler);


async function deleteHandler(req) {
  await dbConnect();

  const { id } = await req.json();
  const email = req.user.email;

  if (!id) {
    return NextResponse.json({ error: "ProductId is required" }, { status: 400 });
  }

  const user = await users.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.cart = user.cart.filter((item) => item.id !== id);
  await user.save();

  return NextResponse.json({ success: true, cart: user.cart });
}
export const DELETE = AuthGuard(deleteHandler);

async function putHandler(req) {
  await dbConnect();

  const { id, action } = await req.json();
  const email = req.user.email;

  if (!id || !["increase", "decrease"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await users.findOneAndUpdate(
    { email },
    {
      $inc: {
        "cart.$[elem].quantity": action === "increase" ? 1 : -1,
      },
    },
    {
      arrayFilters: [{ "elem.id": id }],
    }
  );

  return NextResponse.json({ ok: true });
}
export const PUT = AuthGuard(putHandler);

export const config = {
  runtime: "nodejs",
};
