import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: mongoose.Types.ObjectId;
  isActive: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    stock:       { type: Number, required: true, default: 0, min: 0 },
    images:      [{ type: String }],
    sizes:       [{ type: String }],
    colors:      [{ type: String }],
    category:    { type: Schema.Types.ObjectId, ref: "Category", required: true },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
