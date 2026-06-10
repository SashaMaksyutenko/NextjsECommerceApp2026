import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { search, role, page = 1, limit = 20 } = req.query;
  const filter: Record<string, unknown> = {};

  if (role) filter.role = role;
  if (search) filter.$or = [
    { username: { $regex: search, $options: "i" } },
    { email:    { $regex: search, $options: "i" } },
  ];

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select("-password")
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .sort({ createdAt: -1 });

  res.json({ users, total, page: +page, pages: Math.ceil(total / +limit) });
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json(user);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, role, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { username, email, role, avatar },
    { new: true }
  ).select("-password");
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json(user);
};

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }

  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, isActive: user.isActive });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
