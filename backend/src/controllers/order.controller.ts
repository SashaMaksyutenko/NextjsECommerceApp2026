import { Request, Response } from "express";
import Order from "../models/Order";
import { AuthRequest } from "../middleware/auth";

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { items, shippingAddress } = req.body;
  const totalPrice = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0
  );
  const order = await Order.create({ user: req.user?.id, items, totalPrice, shippingAddress });
  res.status(201).json(order);
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const orders = await Order.find({ user: req.user?.id })
    .populate("items.product", "name images price")
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  const orders = await Order.find()
    .populate("user", "username email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) { res.status(404).json({ message: "Order not found" }); return; }
  res.json(order);
};
