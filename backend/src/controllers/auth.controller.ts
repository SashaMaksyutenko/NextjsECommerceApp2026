import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateAccessToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

const generateRefreshToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sendTokens = async (res: Response, userId: string, role: string) => {
  const accessToken  = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId);

  await User.findByIdAndUpdate(userId, { refreshToken });

  res.cookie("token", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400).json({ message: "Email already in use" });
    return;
  }

  const user = await User.create({ username, email, password });
  await sendTokens(res, String(user._id), user.role);

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

  await sendTokens(res, String(user._id), user.role);

  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "Account is disabled" });
      return;
    }

    await sendTokens(res, String(user._id), user.role);
    res.json({ message: "Token refreshed" });
  } catch {
    res.status(401).json({ message: "Refresh token expired" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;

  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: undefined });
  }

  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const getMe = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id).select("-password -refreshToken");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
};

export const changePassword = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ message: "New password must be at least 6 characters" });
    return;
  }
  const user = await User.findById(req.user?.id);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  if (!(await user.comparePassword(currentPassword))) {
    res.status(400).json({ message: "Current password is incorrect" });
    return;
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: "Password changed successfully" });
};

