import { NextResponse } from "next/server";
import dbConnect from "@/Utils/connectDb";
import Product from "@/models/Product";
import Fuse from 'fuse.js';

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
    const rawQuery = searchParams.get('q');

    const PRODUCTS_PER_PAGE = 30;
    const skip = (page - 1) * PRODUCTS_PER_PAGE;

    let filter = {};
    let searchResults = null;

    
    if (rawQuery && rawQuery.trim().length > 0) {
      const query = rawQuery.toLowerCase().trim();
      
      
      const genderMapping = {
       
        'men': 'Men',
        'mens': 'Men', 
        'man': 'Men',
         'mans': 'Men',
        'male': 'Men',
        'boy': 'Men',
        'boys': 'Men',
        'gentleman': 'Men',
        'guy': 'Men',
        'guys': 'Men',
        
      
        'women': 'Women',
          'womans': 'Women',
           'woman': 'Women',
        'womens': 'Women',
        'woman': 'Women',
        'female': 'Women',
        'girl': 'Women',
        'girls': 'Women',
        'lady': 'Women',
        'ladies': 'Women',
        'gal': 'Women',
        
    
        'kids': 'Kids',
        'kid': 'Kids',
        'children': 'Kids',
        'child': 'Kids',
        'baby': 'Kids',
        'babies': 'Kids',
        'toddler': 'Kids',
        'youth': 'Kids',
        'junior': 'Kids'
      };

     
      let detectedGender = null;
      const words = query.split(/\s+/);
      
      for (const word of words) {
        if (genderMapping[word]) {
          detectedGender = genderMapping[word];
          break;
        }
      }

   
      const allProducts = await Product.find({});
      
  
      const fuseOptions = {
        keys: [
          { name: 'title', weight: 0.3 },
          { name: 'category', weight: 0.2 },
          { name: 'subcategory', weight: 0.2 },
          { name: 'Vendor', weight: 0.15 },
          { name: 'Product_Type', weight: 0.15 }
        ],
        threshold: 0.4, 
        distance: 100,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        shouldSort: true,
        findAllMatches: true,
        ignoreLocation: true 
      };

      let productsToSearch = allProducts;
      if (detectedGender) {
        productsToSearch = allProducts.filter(product => 
          product.category && product.category === detectedGender
        );
     filter.category = detectedGender;
      }

   
      let searchTerms = query;
      let genderDetectedFromQuery = false;
     
      if (detectedGender) {
        const genderWords = Object.keys(genderMapping);
        searchTerms = words.filter(word => !genderWords.includes(word)).join(' ');
        genderDetectedFromQuery = true;
      }
      
      if (searchTerms.trim()) {
        const fuse = new Fuse(productsToSearch, fuseOptions);
        const fuseResults = fuse.search(searchTerms);
        
       
        searchResults = fuseResults.map(result => result.item._id.toString());
        
    
        if (searchResults.length > 0) {
          filter._id = { $in: searchResults.map(id => id) };
        } else {
          
          return NextResponse.json({
            success: true,
            products: [],
            message: `No products found matching "${rawQuery}"`,
            currentPage: 1,
            totalPages: 1,
            totalFilteredProducts: 0,
            fromProduct: 0,
            toProduct: 0,
          }, { status: 200 });
        }
      } else if (genderDetectedFromQuery) {
      
      } else {
        
        return NextResponse.json({
          success: true,
          products: [],
          message: "Please provide search terms",
          currentPage: 1,
          totalPages: 1,
          totalFilteredProducts: 0,
          fromProduct: 0,
          toProduct: 0,
        }, { status: 200 });
      }
    }

 
    if (category && subcategory) {
      if (filter.category && filter.category !== category) {
       
        filter.category = category;
      } else if (!filter.category) {
        filter.category = category;
      }
      filter.subcategory = subcategory;
    } else if (category && !subcategory) {
      if (filter.category && filter.category !== category) {
        filter.category = category;
      } else if (!filter.category) {
        filter.category = category;
      }
    }

  
    if (size) {
      const sizes = size.split(',').map(s => s.trim()).filter(s => s);
      if (sizes.length > 0) {
        filter["sizes.size"] = { $in: sizes };
      }
    }

    if (minPrice && minPrice !== "undefined") {
      const minPriceNum = Number(minPrice);
      if (!isNaN(minPriceNum)) {
        if (!filter.price) filter.price = {};
        filter.price.$gte = minPriceNum;
      }
    }
    
    if (highPrice && highPrice !== "undefined") {
      const highPriceNum = Number(highPrice);
      if (!isNaN(highPriceNum)) {
        if (!filter.price) filter.price = {};
        filter.price.$lte = highPriceNum;
      }
    }

    if (!rawQuery && !category) {
      return NextResponse.json({
        success: false,
        products: [],
        message: "Either provide search query (q) or category parameter",
        currentPage: 1,
        totalPages: 1,
        totalFilteredProducts: 0,
        fromProduct: 0,
        toProduct: 0,
      }, { status: 400 });
    }

  
    let sort = {};
    if (sortBy === "lowtohigh") {
      sort.price = 1;
    } else if (sortBy === "hightolow") {
      sort.price = -1;
    } else if (searchResults && searchResults.length > 0) {

      sort = { _id: 1 }; 
    }

    const totalFilteredProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalFilteredProducts / PRODUCTS_PER_PAGE);

    const fromProduct = totalFilteredProducts === 0 ? 0 : skip + 1;
    const toProduct = Math.min(skip + PRODUCTS_PER_PAGE, totalFilteredProducts);

   
    let products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(PRODUCTS_PER_PAGE);


    if (searchResults && searchResults.length > 0 && !sortBy) {
      const relevanceMap = new Map();
      searchResults.forEach((id, index) => {
        relevanceMap.set(id.toString(), index);
      });
      
      products.sort((a, b) => {
        const aIndex = relevanceMap.get(a._id.toString()) ?? Infinity;
        const bIndex = relevanceMap.get(b._id.toString()) ?? Infinity;
        return aIndex - bIndex;
      });
    }
      
    return NextResponse.json({
      success: true,
      products: products,
      currentPage: page,
      totalPages: totalPages,
      totalFilteredProducts: totalFilteredProducts,
      fromProduct: fromProduct,
      toProduct: toProduct,
    }, { status: 200 });

  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error" 
    }, { status: 500 });
  }
}

export const config = {
  runtime: 'nodejs',
};