import { Request, Response } from "express";
import Category from "../models/Category";

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const category = await Category.create({ name, slug, description });
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) { res.status(404).json({ message: "Category not found" }); return; }
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
