import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  cut_price: { type: Number, required: true },
  main_image: { type: String, required: true },
  main_image_public_id: { type: String },
  images: [String],
  images_public_ids: [String],
  category: { type: String },
  subcategory: { type: String },
  sizes: [mongoose.Schema.Types.Mixed],
  description: [mongoose.Schema.Types.Mixed],
  Vendor: { type: String },
  Product_Type: { type: String },
  discount: { type: Number },
  sold: { type: Number },
  stock: { type: Number },
  createdAt: { type: Date },
  updatedAt: { type: Date },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Return Requested', 'Cancelled'],
    default: 'Processing',
  },
  address: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, required: true },
  total: { type: Number, required: true },
  returnReason: { type: String },
  cancelReason: { type: String },
  product: { type: productSchema, required: true },
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
