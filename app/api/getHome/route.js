export const config = {
  runtime: 'nodejs',
};

import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import HomeCollection from '@/models/HomeCollection';
import Product from '@/models/Product';

export async function GET(req) {
  await dbConnect();
  try {
    const entries = await HomeCollection.find();
    const banner = entries[0]?.banner ;

    const items = [];

    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index];
      const heading = entry.subcategory || 'Collection';
      const category = entry.category;
      const subcategory = entry.subcategory;
      const url = `/Collections?${new URLSearchParams({
        category,
        subcategory
      }).toString()}`;

      const products = [];

      for (let pIndex = 0; pIndex < entry.productIds.length; pIndex++) {
        const product = await Product.findById(entry.productIds[pIndex]);

        if (!product) continue;

        products.push({
          _id:  product._id,
          sizes: product.sizes,
          discount: product.discount || 0,
          main_image: product.main_image || '/fallback.avif',
          title: product.title,
          price: `${Number(product.price).toLocaleString()}`,
          cut_price: `${Number(product.cut_price).toLocaleString()}`,
          stock:`${Number(product.stock).toLocaleString()}`,
        });
      }

      items.push({
        id: index + 1,
        heading,
        url,
        products
      });
    }

    return NextResponse.json({
      success: true,
      banner_Url: banner,
      Items: items
    });
  } catch (err) {
    console.error('Error in GET /api/HomePage:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
