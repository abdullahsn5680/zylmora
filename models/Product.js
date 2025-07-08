import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  cut_price: { type: Number, required: true },
  main_image: { type: String, required: true },
  main_image_public_id: { type: String }, 
  images: [{ type: String }],
  images_public_ids: [{ type: String }], 
  category: { type: String, required: true },
  subcategory: { type: String },
  sizes: [{
    id: Number,
    size: String,
  }],
  description: [{
    id: Number,
    line: String,
  }],
  Vendor: { type: String, default: 'Unknown' },
  Product_Type: { type: String, default: 'Product' },
  discount: { type: Number, default: 0 },
  url: { type: String },
  sold: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
}, {
  timestamps: true
});

productSchema.index({
  title: 'text',
  category: 'text',
  subcategory: 'text',
  Product_Type: 'text',
  Vendor: 'text',
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
