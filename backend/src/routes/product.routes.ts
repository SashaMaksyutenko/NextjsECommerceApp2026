import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { protect, adminOnly } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { productSchema } from "../validation/product.schema";

const router = Router();

router.get("/", getProducts);
router.get("/admin", protect, adminOnly, (req, res) => { req.query.admin = "true"; getProducts(req, res); });
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, validate(productSchema), createProduct);
router.put("/:id", protect, adminOnly, validate(productSchema.partial()), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
