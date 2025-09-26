
import mongoose from 'mongoose';

const globalOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: String,
  total: Number,
  quantity: Number,
  size: String,
  phone: String,
  address: String,
  status: { type: String, default: 'Processing' },
  returnReason: String,
  cancelReason: String,
  product: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GlobalOrder || mongoose.model('GlobalOrder', globalOrderSchema);
