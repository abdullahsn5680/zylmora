import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import Collection from '@/models/Collection';
import { AdminGuard } from '@/Utils/guards';



async function getCollectionsHandler(req) {
  await dbConnect();
  const collections = await Collection.find();
  return NextResponse.json({ success: true, collections });
}


async function postCollectionsHandler(req) {
  try {
    const body = await req.json();
    await dbConnect();

    const allColl = await Collection.find();

    if (allColl.length > body.length) {
      await Collection.deleteMany({});
    }

    for (let index = 0; index < body.length; index++) {
      const collection = body[index];
      const existing = await Collection.findOne({ name: collection.name });
      if (existing) {
        await Collection.findOneAndUpdate({ name: collection.name }, collection);
      } else {
        await Collection.create(collection);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/collections error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}


export const GET = getCollectionsHandler
export const POST = AdminGuard(postCollectionsHandler);

export const config = {
  runtime: 'nodejs',
};
