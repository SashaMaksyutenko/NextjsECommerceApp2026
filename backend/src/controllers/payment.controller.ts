import Stripe from "stripe";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";

let stripeInstance: InstanceType<typeof Stripe> | null = null;
const getStripe = () => {
  if (!stripeInstance) stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return stripeInstance;
};

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { items, shippingFee = 0 } = req.body;

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

  res.status(201).json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
};
