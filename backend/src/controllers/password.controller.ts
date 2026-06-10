import crypto from "crypto";
import { Request, Response } from "express";
import User from "../models/User";
import { sendPasswordResetEmail } from "../lib/email";

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "No user with that email" });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken  = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  res.json({ message: "Password reset email sent" });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken:  hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });

  if (!user) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  user.password            = password;
  user.resetPasswordToken  = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};
