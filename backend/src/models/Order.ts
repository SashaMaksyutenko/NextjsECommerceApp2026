import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    zip: string;
  };
  stripePaymentIntentId?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    user:       { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product:  { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price:    { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status:     { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    shippingAddress: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      country: { type: String, required: true },
      zip:     { type: String, required: true },
    },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
