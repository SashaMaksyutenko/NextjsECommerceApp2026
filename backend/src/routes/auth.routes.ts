import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller";
import { forgotPassword, resetPassword } from "../controllers/password.controller";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validation/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
