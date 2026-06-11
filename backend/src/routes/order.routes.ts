import { Router } from "express";
import { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, cancelOrder } from "../controllers/order.controller";
import { protect, adminOnly } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { orderSchema } from "../validation/order.schema";

const router = Router();

router.post("/", protect, validate(orderSchema), createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, adminOnly, getOrderById);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.post("/:id/cancel", protect, cancelOrder);

export default router;
