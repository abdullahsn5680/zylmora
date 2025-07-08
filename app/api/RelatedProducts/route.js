import { NextResponse } from "next/server";
import dbConnect from "@/Utils/connectDb";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
       const filter = {};
    if (category && category !== "") filter.category = category;
    if (subcategory && subcategory !== "") filter.subcategory = subcategory;
    const products = await Product.find(filter)
      .limit(10);
        console.log(products)

        return NextResponse.json({
            success: true,
            products,
          }, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
