import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400).json({ message: "Email already in use" });
    return;
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(String(user._id), user.role);

  res.cookie("token", token, cookieOptions);
  res.status(201).json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ message: "Account is disabled" });
    return;
  }

  const token = generateToken(String(user._id), user.role);
  res.cookie("token", token, cookieOptions);
  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const getMe = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id).select("-password");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
};
