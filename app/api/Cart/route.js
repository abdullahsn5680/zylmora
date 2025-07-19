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
  try{
  await dbConnect();

  const data = await req.json();
  const {id,email}=data;

  if (!email || !id) {
    console.log(email,id)
    return NextResponse.json({ error: "Email and productId are required" }, { status: 400 });
  }

  const user = await users.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.cart = user.cart.filter((item) => item.id !== id);
  await user.save();

  return NextResponse.json({ success: true, cart: user.cart });}
  catch(err){
console.log(err)
return NextResponse.json({ success:false }, { status: 404 })
  }
}


export async function PUT(req) {
  try{ await dbConnect();
  const data = await req.json();
  const {id,action,email}=data;
  if(action=='increase'){ const user = await users.findOneAndUpdate({email},{
  $inc: {
    'cart.$[elem].quantity': 1
  }
},
{
  arrayFilters: [
    { 'elem.id': id, }
  ]
}
  )}else{
     const user = await users.findOneAndUpdate({email},{
  $inc: {
    'cart.$[elem].quantity': -1
  }
},
{
  arrayFilters: [
    { 'elem.id': id, }
  ]
}
  )
  }
 
 return NextResponse.json({ ok: true,  });}
 catch(error){
 return NextResponse.json({ ok: false,message:'Some thing went wrong'});}
 }
 

export const config = {
  runtime: 'nodejs',
};
