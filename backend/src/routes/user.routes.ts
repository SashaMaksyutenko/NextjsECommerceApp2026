import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, toggleUserStatus, deleteUser } from "../controllers/user.controller";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

router.use(protect, adminOnly);

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.patch("/:id/toggle", toggleUserStatus);
router.delete("/:id", deleteUser);

export default router;
