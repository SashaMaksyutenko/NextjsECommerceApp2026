import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/auth";

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { items, shippingAddress, shippingFee = 0 } = req.body;
  const subtotal = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0
  );
  const totalPrice = subtotal + Number(shippingFee);
  const order = await Order.create({ user: req.user?.id, items, totalPrice, shippingAddress });
  res.status(201).json(order);
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const orders = await Order.find({ user: req.user?.id })
    .populate("items.product", "name images price")
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const { userId, limit } = req.query;
  const filter: Record<string, unknown> = {};
  if (userId) filter.user = String(userId);
  const orders = await Order.find(filter)
    .populate("user", "username email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .limit(limit ? +limit : 0);
  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.id)
    .populate("user", "username email")
    .populate("items.product", "name images price");
  if (!order) { res.status(404).json({ message: "Order not found" }); return; }
  res.json(order);
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

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user?.id });
  if (!order) { res.status(404).json({ message: "Order not found" }); return; }
  if (!["pending", "processing"].includes(order.status)) {
    res.status(400).json({ message: "Cannot cancel order at this stage" });
    return;
  }
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );
  order.status = "cancelled";
  await order.save();
  res.json(order);
};
