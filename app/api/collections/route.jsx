

import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import Collection from '@/models/Collection';


export async function GET() {
  await dbConnect();
  const collections = await Collection.find();
  return NextResponse.json({ success: true, collections });
}


export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect()
    for (let index = 0; index < body.length; index++) {
         const collection=  body[index]
         console.log(collection)
        
        const existing = await Collection.findOne({name:collection.name})
        if(existing){
       const update = await Collection.findOneAndUpdate({name:collection.name},collection)
        }else{
        const addNew = await Collection.create(collection)}}
  
    return NextResponse.json({ success: true, });
  } catch (error) {
    console.error('POST /api/collections error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const body = await req.json();
    await dbConnect()
    for (let index = 0; index < body.length; index++) {
           const Delete = await Collection.findByIdAndDelete({_id:body[index].id});
         }
    return NextResponse.json({ success: true, });
  } catch (error) {
    console.error('POST /api/collections error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
export const config = {
  runtime: 'nodejs',
};
