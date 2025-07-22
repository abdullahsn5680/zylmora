export const config = {
  runtime: 'nodejs',
};

import { NextResponse } from "next/server";
import Product from "@/models/Product";
import dbConnect from "@/Utils/connectDb";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { v2 as cloudinary } from "cloudinary";
import Catagories from "@/models/Catagories";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      title,
      price,
      cut_price,
      Vendor,
      discount,
      category,
      subcategory,
      sizes,
      main_image,
      images,
      description,
    } = body;
   
    const mainImageUpload = await uploadToCloudinary(main_image, "Products_Img");
    if (!mainImageUpload) {
      return NextResponse.json({ error: "Main image upload failed" }, { status: 500 });
    }

    const existingProduct = await Product.findOne({
      title,
      category,
      subcategory,
      Vendor,
    });

    if (existingProduct) {
      return NextResponse.json({
        success: false,
        message:
          "Product already exists with the same title, vendor, category, and subcategory.",
      }, { status: 400 });
    }

    const imageUploads = await Promise.all(
      (images || []).slice(0, 4).map((base64) => uploadToCloudinary(base64, "Products_Img"))
    );

    const imageUrls = imageUploads.map((item) => item?.url).filter(Boolean);
    const imagePublicIds = imageUploads.map((item) => item?.public_id).filter(Boolean);
    const name = `${category}-${subcategory}`
    const isExists = await Catagories.findOne({name:name})
    if(!isExists){
      const newCat = new Catagories({
        name:name,
        image:mainImageUpload.url,
        cat:category,
        subCat:subcategory,
      })
      await newCat.save();
    }
    const newProduct = await Product.create({
      Vendor,
      discount,
      title,
      price,
      cut_price,
      category,
      subcategory,
      sizes,
      description,
      main_image: mainImageUpload.url,
      main_image_public_id: mainImageUpload.public_id,
      images: imageUrls,
      images_public_ids: imagePublicIds,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...rest } = body;

   
    const currentProduct = await Product.findById(_id);
    if (!currentProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(_id, rest, { new: true });

  
    const categoryChanged = currentProduct.category !== updatedProduct.category || 
                           currentProduct.subcategory !== updatedProduct.subcategory;

    if (categoryChanged) {
    
      const newCategoryName = `${updatedProduct.category}-${updatedProduct.subcategory}`;
    
      const newCategoryExists = await Catagories.findOne({name: newCategoryName});
      if (!newCategoryExists) {
        const newCategory = new Catagories({
          name: newCategoryName,
          image: updatedProduct.main_image,
          cat: updatedProduct.category,
          subCat: updatedProduct.subcategory,
        });
        await newCategory.save();
      } else {
       
        await Catagories.findOneAndUpdate(
          {name: newCategoryName},
          {image: updatedProduct.main_image}
        );
      }

      const oldCategoryName = `${currentProduct.category}-${currentProduct.subcategory}`;
      const remainingProducts = await Product.countDocuments({
        category: currentProduct.category,
        subcategory: currentProduct.subcategory
      });

      if (remainingProducts === 0) {
        await Catagories.findOneAndDelete({name: oldCategoryName});
      }
    } else {
     
      const categoryName = `${updatedProduct.category}-${updatedProduct.subcategory}`;
      await Catagories.findOneAndUpdate(
        {name: categoryName},
        {image: updatedProduct.main_image}
      );
    }

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const categoryName = `${product.category}-${product.subcategory}`;

    if (product.main_image_public_id) {
      await cloudinary.uploader.destroy(product.main_image_public_id);
    }

    if (product.images_public_ids?.length > 0) {
      for (let i = 0; i < product.images_public_ids.length; i++) {
        await cloudinary.uploader.destroy(product.images_public_ids[i]);
      }
    }

    await Product.findByIdAndDelete(id);

    const remainingProducts = await Product.countDocuments({
      category: product.category,
      subcategory: product.subcategory
    });

    if (remainingProducts === 0) {
      await Catagories.findOneAndDelete({name: categoryName});
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const pid = searchParams.get("id");

    if (!pid) {
      return NextResponse.json({ success: false, message: "Product ID is missing" }, { status: 400 });
    }

    const product = await Product.findById(pid);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}