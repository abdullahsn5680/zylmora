
import mongoose from 'mongoose';

const SubSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const CollectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subs:  [{ type: String }],
});

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
