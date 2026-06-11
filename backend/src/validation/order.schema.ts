import { z } from "zod";

export const orderSchema = z.object({
  items: z.array(
    z.object({
      product:  z.string().min(1),
      quantity: z.number().int().min(1),
      price:    z.number().min(0),
    })
  ).min(1, "Order must have at least one item"),
  shippingAddress: z.object({
    street:  z.string().min(1),
    city:    z.string().min(1),
    country: z.string().min(1),
    zip:     z.string().min(1),
  }),
  shippingFee: z.number().min(0).optional(),
});
