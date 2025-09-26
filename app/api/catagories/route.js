import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import Catagories from '@/models/Catagories';

export async function GET() {
  try {
    await dbConnect();
    const catagories = await Catagories.find();
    
    return NextResponse.json({ 
      success: true, 
      categories: catagories 
    });
  } catch (error) {
    console.error('GET /api/catagories error:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error" 
    }, { status: 500 });
  }
}