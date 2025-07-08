
import mongoose from 'mongoose';

const HomeSchema = new mongoose.Schema({
  category: String,
  subcategory: String,
  productIds: [String],
  banner: String,
});

export default mongoose.models.HomeCollection || mongoose.model('HomeCollection', HomeSchema);
