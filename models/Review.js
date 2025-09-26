import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  pid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   
  name: { type: String, required: true },                                        
  rating: { type: Number, required: true, min: 1, max: 5 },                    
  date: { type: Date, default: Date.now },                                                           
  title: { type: String, required: true },                                       
  content: { type: String, required: true },                                    
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
