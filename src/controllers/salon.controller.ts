import { Response } from "express";
import Salon from "../models/Salon.js";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createSalon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { businessName, subdomain } = req.body;

  const exists = await Salon.findOne({ subdomain });
  if (exists) return sendError(res, "Subdomain already taken", 400);

  const salon = await Salon.create({
    businessName,
    subdomain,
    ownerId: req.userId,
    status: "trial",
  });

  await User.findByIdAndUpdate(req.userId, { salonId: salon._id });

  return sendSuccess(res, "Salon created successfully", salon, 201);
});

export const getSalon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const salon = await Salon.findById(req.salonId);
  if (!salon) return sendError(res, "Salon not found", 404);

  return sendSuccess(res, "Salon fetched", salon);
});