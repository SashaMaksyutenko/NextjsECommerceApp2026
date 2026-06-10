import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller";
import { protect, adminOnly } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", protect, adminOnly, upload.single("image"), uploadImage);

export default router;
