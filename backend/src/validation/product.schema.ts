import { z } from "zod";

export const productSchema = z.object({
  name:        z.string().min(2, "Name min 2 chars"),
  description: z.string().min(10, "Description min 10 chars"),
  price:       z.number().min(0, "Price must be positive"),
  stock:       z.number().int().min(0, "Stock must be positive"),
  images:      z.array(z.string().url()).optional(),
  sizes:       z.array(z.string()).optional(),
  colors:      z.array(z.string()).optional(),
  category:    z.string().min(1, "Category required"),
  isActive:    z.boolean().optional(),
});
