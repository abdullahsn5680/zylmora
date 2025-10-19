import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 10));
    const skip = (page - 1) * limit;

    const rawQuery = searchParams.get('q');
    
    // Handle empty query - return all products with pagination
    if (!rawQuery || rawQuery.trim().length === 0) {
      const total = await Product.countDocuments();
      const products = await Product.find()
        .select('title category subcategory price cut_price image main_image sold stock _id Product_Type Vendor')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        products,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      });
    }

    // Process search query
    const query = rawQuery.toLowerCase().trim();
    const words = query.split(/\s+/).filter((w) => w.length > 0);

    const genderCategories = ['men', 'women', 'kids'];
    let gender = null;
    const otherWords = [];

    // Separate gender from other search terms
    for (const word of words) {
      if (genderCategories.includes(word)) {
        gender = word;
      } else {
        otherWords.push(word);
      }
    }

    // Build query conditions
    const conditions = [];
    
    if (gender) {
      conditions.push({ category: gender });
    }

    if (otherWords.length > 0) {
      // Create OR conditions for each word across multiple fields
      const searchConditions = otherWords.map(word => ({
        $or: [
          { title: { $regex: word, $options: 'i' } },
          { subcategory: { $regex: word, $options: 'i' } },
          { Product_Type: { $regex: word, $options: 'i' } },
          { Vendor: { $regex: word, $options: 'i' } },
        ],
      }));
      
      conditions.push(...searchConditions);
    }

    const queryFilter = conditions.length > 0 ? { $and: conditions } : {};

    // Execute count and find in parallel for better performance
    const [total, products] = await Promise.all([
      Product.countDocuments(queryFilter),
      Product.find(queryFilter)
        .select('title category subcategory price cut_price image main_image sold stock _id Product_Type Vendor')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      products,
      total,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }, { status: 200 });

  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json(
      { success: false, message: 'Error during search', error: err.message },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'nodejs',
};