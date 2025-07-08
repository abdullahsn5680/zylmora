import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    address: [{type: mongoose.Schema.Types.Mixed}] ,
    isactive: { type: Boolean, default: true, },
    admin: { type: Boolean, default: false, },
    cart: [{ type: mongoose.Schema.Types.Mixed }],
    wishlist: [{ type: mongoose.Schema.Types.Mixed }],
    orders: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true }
);

export default mongoose.models.users || mongoose.model("users", UserSchema);
