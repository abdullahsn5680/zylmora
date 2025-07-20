import { NextResponse } from "next/server";
import dbConnect from "@/Utils/connectDb";
import Product from "@/models/Product";
import { stemmer } from 'stemmer';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const highPrice = searchParams.get("highPrice");
    const sortBy = searchParams.get("sortBy");
    const page = parseInt(searchParams.get("page")) || 1;
    const rawQuery = searchParams.get('q')?.toLowerCase();

    const PRODUCTS_PER_PAGE = 30;
    const skip = (page - 1) * PRODUCTS_PER_PAGE;

    let filter = {};

  
    if (rawQuery && rawQuery.trim().length > 0 && (!category || !subcategory)) {
      const genderCategories = ['men', 'women', 'kids'];
      const words = rawQuery.split(/[\s\-_,]+/).filter(Boolean);

      const gender = words.find((w) => genderCategories.includes(w));
      const otherWords = words.filter((w) => !genderCategories.includes(w));
      const stemmedKeywords = otherWords.map((kw) => stemmer(kw));

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

      filter = conditions.length > 0 ? { $and: conditions } : {};
    }
  
    else if (category && subcategory) {
      filter = {
        category,
        subcategory,
      };

      if (rawQuery && rawQuery.trim().length > 0) {
        const words = rawQuery.split(/[\s\-_,]+/).filter(Boolean);
        const stemmedKeywords = words.map((kw) => stemmer(kw));

        if (stemmedKeywords.length > 0) {
          const searchConditions = [];
          
          for (const kw of stemmedKeywords) {
            searchConditions.push({
              $or: [
                { title: { $regex: kw, $options: 'i' } },
                { Product_Type: { $regex: kw, $options: 'i' } },
                { Vendor: { $regex: kw, $options: 'i' } },
              ],
            });
          }

          filter.$and = searchConditions;
        }
      }

      if (size) filter["sizes.size"] = size;
      if (minPrice && minPrice !== "undefined") {
        filter.price = { ...filter.price, $gte: Number(minPrice) };
      }
      if (highPrice && highPrice !== "undefined") {
        filter.price = { ...filter.price, $lte: Number(highPrice) };
      }
    }
    else {
      return NextResponse.json({
        success: false,
        products: [],
        message: "Either provide search query (q) or both category and subcategory",
        currentPage: 1,
        totalPages: 1,
        totalFilteredProducts: 0,
        fromProduct: 0,
        toProduct: 0,
      }, { status: 400 });
    }

    let sort = {};
    if (sortBy === "lowtohigh") sort.price = 1;
    else if (sortBy === "hightolow") sort.price = -1;

  
    const totalFilteredProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalFilteredProducts / PRODUCTS_PER_PAGE);

    const fromProduct = totalFilteredProducts === 0 ? 0 : skip + 1;
    const toProduct = Math.min(skip + PRODUCTS_PER_PAGE, totalFilteredProducts);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(PRODUCTS_PER_PAGE);

    return NextResponse.json({
      success: true,
      products,
      currentPage: page,
      totalPages,
      totalFilteredProducts,
      fromProduct,
      toProduct,
    }, { status: 200 });

  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export const config = {
  runtime: 'nodejs',
};