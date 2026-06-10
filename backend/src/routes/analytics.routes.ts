import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

router.get("/", protect, adminOnly, getAnalytics);

export default router;
