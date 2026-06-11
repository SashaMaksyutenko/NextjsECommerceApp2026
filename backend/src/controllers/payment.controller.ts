import Stripe from "stripe";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";
import { sendOrderConfirmationEmail } from "../lib/email";

let stripeInstance: InstanceType<typeof Stripe> | null = null;
const getStripe = () => {
  if (!stripeInstance) stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return stripeInstance;
};

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { items, shippingAddress, shippingFee = 0 } = req.body;

  const subtotal = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );
  const totalPrice = subtotal + Number(shippingFee);

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: Math.round(totalPrice * 100),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  const order = await Order.create({
    user: req.user?.id,
    items,
    totalPrice,
    shippingAddress,
    stripePaymentIntentId: paymentIntent.id,
    status: "processing",
  });

  // Reduce stock for each ordered product
  await Promise.all(
    (items as { product: string; quantity: number }[]).map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  // Fire-and-forget email confirmation
  (async () => {
    try {
      const user = await User.findById(req.user?.id).select("email");
      if (!user?.email) return;
      const populated = await Promise.all(
        (items as { product: string; quantity: number; price: number }[]).map(async (item) => {
          const p = await Product.findById(item.product).select("name");
          return { name: p?.name || "Product", quantity: item.quantity, price: item.price };
        })
      );
      await sendOrderConfirmationEmail(user.email, {
        orderId: String(order._id),
        items: populated,
        totalPrice,
        shippingAddress,
      });
    } catch {}
  })();

  res.status(201).json({
    clientSecret: paymentIntent.client_secret,
    orderId: order._id,
  });
};
