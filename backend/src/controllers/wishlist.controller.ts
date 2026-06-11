import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id).populate(
    "wishlist",
    "name price images category isActive"
  );
  res.json(user?.wishlist || []);
};

export const toggleWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const productId = String(req.params.productId);
  const user = await User.findById(req.user?.id);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }

  const idx = user.wishlist.findIndex((id) => id.toString() === productId);
  if (idx === -1) {
    (user.wishlist as mongoose.Types.Array<mongoose.Types.ObjectId>).push(
      new mongoose.Types.ObjectId(productId)
    );
  } else {
    user.wishlist.splice(idx, 1);
  }
  await user.save();
  res.json({ inWishlist: idx === -1 });
};
