import { Request, Response } from "express";
import Product from "../models/Product";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const { category, search, page = 1, limit = 12, sort } = req.query;
  const filter: Record<string, unknown> = { isActive: true };

  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest:  { createdAt: -1 },
    oldest:  { createdAt:  1 },
    asc:     { price:      1 },
    desc:    { price:     -1 },
  };
  const sortQuery = sortMap[sort as string] || { createdAt: -1 };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .sort(sortQuery);

  res.json({ products, total, page: +page, pages: Math.ceil(total / +limit) });
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.id).populate("category", "name slug");
  if (!product) { res.status(404).json({ message: "Product not found" }); return; }
  res.json(product);
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) { res.status(404).json({ message: "Product not found" }); return; }
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
