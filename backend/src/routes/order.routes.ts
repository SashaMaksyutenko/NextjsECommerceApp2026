import { Router } from "express";
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller";
import { protect, adminOnly } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { orderSchema } from "../validation/order.schema";

const router = Router();

router.post("/", protect, validate(orderSchema), createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
