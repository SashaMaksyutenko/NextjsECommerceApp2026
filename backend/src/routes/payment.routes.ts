import { Router } from "express";
import { createPaymentIntent } from "../controllers/payment.controller";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { paymentIntentSchema } from "../validation/payment.schema";

const router = Router();

router.post("/intent", protect, validate(paymentIntentSchema), createPaymentIntent);

export default router;
