import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get('q');

   
    if (!rawQuery || rawQuery.trim().length === 0) {
      const fallbackProducts = await Product.find().sort({ _id: -1 }).limit(50);
      return NextResponse.json({ success: true, products: fallbackProducts });
    }

  
    const query = rawQuery.toLowerCase().trim();
    const words = query.split(' ');
    
    
    const cleanWords = [];
    for (let i = 0; i < words.length; i++) {
      if (words[i].trim().length > 0) {
        cleanWords.push(words[i].trim());
      }
    }

    const genderCategories = ['men', 'women', 'kids'];
    
    
    let gender = null;
    const otherWords = [];
    
    for (let i = 0; i < cleanWords.length; i++) {
      const word = cleanWords[i];
      let isGender = false;
      
      for (let j = 0; j < genderCategories.length; j++) {
        if (word === genderCategories[j]) {
          gender = word;
          isGender = true;
          break;
        }
      }
      
      if (!isGender) {
        otherWords.push(word);
      }
    }

    
    const conditions = [];

    if (gender) {
      conditions.push({ category: gender });
    }

    for (let i = 0; i < otherWords.length; i++) {
      const word = otherWords[i];
      conditions.push({
        $or: [
          { title: { $regex: word, $options: 'i' } },
          { subcategory: { $regex: word, $options: 'i' } },
          { Product_Type: { $regex: word, $options: 'i' } },
          { Vendor: { $regex: word, $options: 'i' } },
        ],
      });
    }

   
    let queryFilter = {};
    if (conditions.length > 0) {
      queryFilter = { $and: conditions };
    }

    const products = await Product.find(queryFilter).limit(50);


    if (products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No matching products found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, products: products }, { status: 200 });
    
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json(
      { success: false, message: 'Error during search' },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'nodejs',
};