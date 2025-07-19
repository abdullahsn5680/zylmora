export const config = {
  runtime: 'nodejs',
};

import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import HomeCollection from '@/models/HomeCollection';
import { v2 as cloudinary } from 'cloudinary';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  await dbConnect();

  try {
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ success: false, message: 'Empty request body' }, { status: 400 });
    }

    const entries = JSON.parse(text);

    const oldEntries = await HomeCollection.find();

    await HomeCollection.deleteMany({});

    const uploadedEntries = await Promise.all(entries.map(async (entry, index) => {
      const oldEntry = oldEntries[index]; 

      let bannerUrl = oldEntry?.banner || '';
      let bannerPublicId = oldEntry?.banner_public_id || '';

      if (entry.banner?.startsWith('data:image')) {
      
        if (bannerPublicId) {
          try {
            await cloudinary.uploader.destroy(bannerPublicId);
          } catch (e) {
            console.warn('Failed to delete old image:', bannerPublicId, e.message);
          }
        }

        const uploaded = await uploadToCloudinary(entry.banner, 'HomePage_Banners');
        bannerUrl = uploaded?.url || '';
        bannerPublicId = uploaded?.public_id || '';
      }

      return {
        category: entry.category,
        subcategory: entry.subcategory,
        productIds: entry.productIds,
        banner: bannerUrl,
        banner_public_id: bannerPublicId,
      };
    }));

    const saved = await HomeCollection.insertMany(uploadedEntries);
    return NextResponse.json({ success: true, saved });

  } catch (err) {
    console.error('Error in POST /api/HomePage:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}


export async function DELETE() {
  await dbConnect();

  try {
    const entries = await HomeCollection.find();
    for (let entry of entries) {
      if (entry.banner_public_id) {
        await cloudinary.uploader.destroy(entry.banner_public_id);
      }
    }

    await HomeCollection.deleteMany({});
    return NextResponse.json({ success: true, message: 'All homepage entries deleted' });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const entries = await HomeCollection.find();
    
    return NextResponse.json({ success: true, entries,});
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to fetch entries' }, { status: 500 });
  }
}
