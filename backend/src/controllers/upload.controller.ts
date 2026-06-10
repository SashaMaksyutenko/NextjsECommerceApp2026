import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataUri = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "ecommerce2026",
  });

  res.status(200).json({ url: result.secure_url });
};
