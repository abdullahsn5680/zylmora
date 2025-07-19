import { NextResponse } from "next/server";
import GlobalOrder from "@/models/GlobalOrder";
import Order from "@/models/Order";
import dbConnect from "@/Utils/connectDb";
export  const POST=async(request)=>{
const data = await request.json();
try{
     await dbConnect();
    const {Info,Orders}=data;
    if(!Info||!Orders){
        return NextResponse.json({ success: false },{message:'All fildes are required'}, { status: 400 });
    } 
       
    
        
        const count = await GlobalOrder.countDocuments();


        for (let index = 0; index < Orders.length; index++) {
          
            
        
        const orderId = `ORD-${String(count + 1+index).padStart(5, '0')}`;
        const totalPrice = Orders[index].cut_price * Orders[index].quantity;
    
        const newOrder = await Order.create({
          id: orderId,
          total: totalPrice,
          quantity: Orders[index].quantity,
          size: Orders[index].size,
          phone: Info.phone,
          userId: Info.userId,
          address: Info.address,
          product: { _id:Orders[index].id,
      title: Orders[index].title,
      size: Orders[index].size,
      vendor: Orders[index].vendor,
      price: Orders[index].price,
      quantity: Orders[index].quantity,
      cut_price: Orders[index].cut_price,
      main_image:Orders[index].image,}
        });
    
        await GlobalOrder.create({
       orderId,
          total: totalPrice,
          quantity: Orders[index].quantity,
          size: Orders[index].size,
          phone: Info.phone,
          userId: Info.userId,
          address: Info.address,
          product: { _id:Orders[index].id,
      title: Orders[index].title,
      size: Orders[index].size,
      vendor: Orders[index].vendor,
      price: Orders[index].price,
      quantity: Orders[index].quantity,
      cut_price: Orders[index].cut_price,
      main_image:Orders[index].image,},
        });


    }

return NextResponse.json({ success: true, }, { status: 200 });
}catch(err){
    console.log(err)
return NextResponse.json({ success: false },{message:err}, { status: 400 });
}


 
}