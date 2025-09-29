import { NextResponse } from "next/server";
import Product from "@/models/Product";
import dbConnect from "@/Utils/connectDb";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { v2 as cloudinary } from "cloudinary";
import Catagories from "@/models/Catagories";
import { AdminGuard, AuthGuard } from "@/Utils/guards";


export const config = { runtime: 'nodejs' };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


async function createProductHandler(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      title, price, cut_price, Vendor, discount,
      category, subcategory, sizes, main_image,
      images, description
    } = body;

    const mainImageUpload = await uploadToCloudinary(main_image, "Products_Img");
    if (!mainImageUpload) {
      return NextResponse.json({ error: "Main image upload failed" }, { status: 500 });
    }

    const existingProduct = await Product.findOne({ title, category, subcategory, Vendor });
    if (existingProduct) {
      return NextResponse.json({
        success: false,
        message: "Product already exists with the same title, vendor, category, and subcategory."
      }, { status: 400 });
    }

    const imageUploads = [];
    const imagesToProcess = images || [];
    const maxImages = imagesToProcess.length > 4 ? 4 : imagesToProcess.length;

    for (let i = 0; i < maxImages; i++) {
      const uploadResult = await uploadToCloudinary(imagesToProcess[i], "Products_Img");
      imageUploads.push(uploadResult);
    }

    const imageUrls = [];
    const imagePublicIds = [];
    for (let i = 0; i < imageUploads.length; i++) {
      if (imageUploads[i]?.url) imageUrls.push(imageUploads[i].url);
      if (imageUploads[i]?.public_id) imagePublicIds.push(imageUploads[i].public_id);
    }

    const categoryName = `${category}-${subcategory}`;
    const isExists = await Catagories.findOne({ name: categoryName });
    if (!isExists) {
      const newCat = new Catagories({
        name: categoryName,
        image: mainImageUpload.url,
        cat: category,
        subCat: subcategory,
      });
      await newCat.save();
    }

    const newProduct = await Product.create({
      Vendor, discount, title, price, cut_price, category, subcategory,
      sizes, description, main_image: mainImageUpload.url,
      main_image_public_id: mainImageUpload.public_id,
      images: imageUrls, images_public_ids: imagePublicIds
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
async function updateProductHandler(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...rest } = body;

    const currentProduct = await Product.findById(_id);
    if (!currentProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const {
      title, price, cut_price, Vendor, discount,
      category, subcategory, size, main_image,
      stock, images = [], description, previewImgToDel = []
    } = rest;

    
    let mainImageUpload = {
      url: currentProduct.main_image,
      public_id: currentProduct.main_image_public_id
    };

    if (main_image && !main_image.includes('https://res.cloudinary.com/')) {
      mainImageUpload = await uploadToCloudinary(main_image, "Products_Img");
      if (!mainImageUpload) return NextResponse.json({ error: "Main image upload failed" }, { status: 500 });

    
      if (currentProduct.main_image_public_id) {
        await cloudinary.uploader.destroy(currentProduct.main_image_public_id).catch(err => {
          if (err.http_code !== 404) console.error("Cloudinary main image delete error:", err);
        });
      }
    }

   
    let imageUrls = currentProduct.images || [];
    let imagePublicIds = currentProduct.images_public_ids || [];

    if (images.length > 0) {
      const uploads = await Promise.all(
        images.slice(0, 4).map(img => uploadToCloudinary(img, "Products_Img"))
      );
      imageUrls = uploads.map(u => u.url).filter(Boolean);
      imagePublicIds = uploads.map(u => u.public_id).filter(Boolean);
    }

    
    if (previewImgToDel.length > 0) {
      await Promise.all(
        previewImgToDel.map(publicId =>
          cloudinary.uploader.destroy(publicId).catch(err => {
            if (err.http_code !== 404) console.error(`Cloudinary delete error (${publicId}):`, err);
          })
        )
      );

     
      imageUrls = imageUrls.filter((_, idx) => !previewImgToDel.includes(imagePublicIds[idx]));
      imagePublicIds = imagePublicIds.filter(id => !previewImgToDel.includes(id));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        Vendor,
        discount,
        title,
        price,
        cut_price,
        category,
        subcategory,
        size,
        description,
        stock,
        main_image: mainImageUpload.url,
        main_image_public_id: mainImageUpload.public_id,
        images: imageUrls,
        images_public_ids: imagePublicIds
      },
      { new: true }
    );

  
    const categoryChanged =
      currentProduct.category !== updatedProduct.category ||
      currentProduct.subcategory !== updatedProduct.subcategory;

    if (categoryChanged) {
      const newCategoryName = `${updatedProduct.category}-${updatedProduct.subcategory}`;
      const newCategoryExists = await Catagories.findOne({ name: newCategoryName });

      if (!newCategoryExists) {
        await new Catagories({
          name: newCategoryName,
          image: updatedProduct.main_image,
          cat: updatedProduct.category,
          subCat: updatedProduct.subcategory
        }).save();
      } else {
        await Catagories.findOneAndUpdate(
          { name: newCategoryName },
          { image: updatedProduct.main_image }
        );
      }

      const oldCategoryName = `${currentProduct.category}-${currentProduct.subcategory}`;
      const remainingProducts = await Product.countDocuments({
        category: currentProduct.category,
        subcategory: currentProduct.subcategory
      });

      if (remainingProducts === 0) {
        await Catagories.findOneAndDelete({ name: oldCategoryName });
      }
    } else {
      const categoryName = `${updatedProduct.category}-${updatedProduct.subcategory}`;
      await Catagories.findOneAndUpdate({ name: categoryName }, { image: updatedProduct.main_image });
    }

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}



async function deleteProductHandler(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    if (product.main_image_public_id) await cloudinary.uploader.destroy(product.main_image_public_id);
    if (product.images_public_ids) {
      for (let i = 0; i < product.images_public_ids.length; i++) {
        await cloudinary.uploader.destroy(product.images_public_ids[i]);
      }
    }

    await Product.findByIdAndDelete(id);

    const categoryName = `${product.category}-${product.subcategory}`;
    const remainingProducts = await Product.countDocuments({ category: product.category, subcategory: product.subcategory });
    if (remainingProducts === 0) await Catagories.findOneAndDelete({ name: categoryName });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

async function getProductHandler(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const pid = url.searchParams.get("id");
    if (!pid) return NextResponse.json({ success: false, message: "Product ID is missing" }, { status: 400 });

    const product = await Product.findById(pid);
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


export const GET = AuthGuard(getProductHandler);
export const POST = AdminGuard(createProductHandler);
export const PUT = AdminGuard(updateProductHandler);
export const DELETE = AdminGuard(deleteProductHandler);
