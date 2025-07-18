import { NextResponse } from "next/server";
import GlobalOrder from "@/models/GlobalOrder";
import OrdersPage from "@/app/(front-app)/Profile/Orders/page";
import dbConnect from "@/Utils/connectDb";
export  const POST=async(request)=>{
const data = await request.json();
console.log(data)


 return NextResponse.json({ success: true, }, { status: 200 });
}