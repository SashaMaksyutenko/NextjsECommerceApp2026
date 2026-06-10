import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

export const getAnalytics = async (_req: Request, res: Response): Promise<void> => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [monthlyRevenue, ordersByStatus, totalUsers, totalProducts, totalOrders] =
    await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$totalPrice" },
            successful: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, "$totalPrice", 0],
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
    ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const revenue = monthlyRevenue.map((m) => ({
    month: months[m._id - 1],
    total: Math.round(m.total),
    successful: Math.round(m.successful),
    count: m.count,
  }));

  const totalRevenue = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, sum: { $sum: "$totalPrice" } } },
  ]);

  res.json({
    monthlyRevenue: revenue,
    ordersByStatus: ordersByStatus.map((o) => ({ status: o._id, count: o.count })),
    summary: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.sum || 0,
    },
  });
};
