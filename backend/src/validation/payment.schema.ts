import { z } from "zod";

const orderItemSchema = z.object({
  product: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
});

const shippingAddressSchema = z.object({
  street:  z.string().min(1),
  city:    z.string().min(1),
  country: z.string().min(1),
  zip:     z.string().min(1),
});

export const paymentIntentSchema = z.object({
  items:           z.array(orderItemSchema).min(1),
  shippingAddress: shippingAddressSchema,
  shippingFee:     z.number().min(0).optional(),
});
