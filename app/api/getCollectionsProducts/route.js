import { NextResponse } from "next/server";
import dbConnect from "@/Utils/connectDb";
import Product from "@/models/Product";

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

    const PRODUCTS_PER_PAGE = 30;
    const skip = (page - 1) * PRODUCTS_PER_PAGE;

    if (!category || !subcategory) {
      return NextResponse.json({
        success: false,
        products: [],
        message: "Both category and subcategory must be selected",
        currentPage: 1,
        totalPages: 1,
        totalFilteredProducts: 0,
        fromProduct: 0,
        toProduct: 0,
      });
    }

    const filter = {
      category,
      subcategory,
    };

    if (size) filter["sizes.size"] = size;
    if (minPrice && minPrice !== "undefined") {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    if (highPrice && highPrice !== "undefined") {
      filter.price = { ...filter.price, $lte: Number(highPrice) };
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
