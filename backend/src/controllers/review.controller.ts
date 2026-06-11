import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import Review from "../models/Review";

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  const productId = String(req.params.id);
  const reviews = await Review.find({ product: new mongoose.Types.ObjectId(productId) })
    .populate("user", "username avatar")
    .sort({ createdAt: -1 });

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  res.json({ reviews, avgRating: Math.round(avg * 10) / 10, total: reviews.length });
};

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    res.status(400).json({ message: "Rating and comment are required" });
    return;
  }

  const productId = String(req.params.id);
  const userId = String(req.user?.id);

  const existing = await Review.findOne({
    user: new mongoose.Types.ObjectId(userId),
    product: new mongoose.Types.ObjectId(productId),
  });
  if (existing) {
    res.status(409).json({ message: "You have already reviewed this product" });
    return;
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating: Number(rating),
    comment,
  });

  const populated = await Review.findById(review._id).populate("user", "username avatar");
  res.status(201).json(populated);
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const review = await Review.findById(String(req.params.reviewId));
  if (!review) { res.status(404).json({ message: "Review not found" }); return; }

  const isOwner = review.user.toString() === req.user?.id;
  const isAdmin = req.user?.role === "admin";
  if (!isOwner && !isAdmin) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  await review.deleteOne();
  res.json({ message: "Review deleted" });
};
