import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import Product from '@/models/Product';
import { stemmer } from 'stemmer';



export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get('q')?.toLowerCase();

    if (!rawQuery || rawQuery.trim().length === 0) {
      const fallbackProducts = await Product.find().sort({ _id: -1 }).limit(50);
      return NextResponse.json({ success: true, products: fallbackProducts });
    }

    const genderCategories = ['men', 'women', 'kids'];
    const words = rawQuery.split(/[\s\-_,]+/).filter(Boolean);

    const gender = words.find((w) => genderCategories.includes(w));
    const otherWords = words.filter((w) => !genderCategories.includes(w));
    const stemmedKeywords = otherWords.map((kw) => stemmer.stem(kw));

    const conditions = [];

    if (gender) {
      conditions.push({ category: { $regex: `^${gender}$`, $options: 'i' } });
    }

    for (const kw of stemmedKeywords) {
      conditions.push({
        $or: [
          { title: { $regex: kw, $options: 'i' } },
          { subcategory: { $regex: kw, $options: 'i' } },
          { Product_Type: { $regex: kw, $options: 'i' } },
          { Vendor: { $regex: kw, $options: 'i' } },
        ],
      });
    }

    const queryFilter = conditions.length > 0 ? { $and: conditions } : {};

    const products = await Product.find(queryFilter).limit(50);

    if (products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No matching products found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json(
      { success: false, message: 'Error during search' },
      { status: 500 }
    );
  }
}
