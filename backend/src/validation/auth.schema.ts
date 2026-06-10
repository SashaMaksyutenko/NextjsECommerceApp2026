import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2, "Username min 2 chars").max(30),
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "Password min 6 chars"),
});

export const loginSchema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});
