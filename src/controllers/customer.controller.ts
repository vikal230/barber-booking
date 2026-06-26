import { Response } from "express";
import Salon from "../models/Salon.js";
import Barber from "../models/Barber.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const exploreSalons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search } = req.query;

  const filter: Record<string, unknown> = { status: "active" };

  if (search) {
    filter.businessName = { $regex: search, $options: "i" };
  }

  const salons = await Salon.find(filter).select("businessName subdomain status");
  return sendSuccess(res, "Salons fetched", salons);
});

export const getSalonDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const salon = await Salon.findOne({
    subdomain: req.params.subdomain,
    status: "active",
  });

  if (!salon) return sendError(res, "Salon not found", 404);

  const barbers = await Barber.find({
    salonId: salon._id,
    isAvailable: true,
  }).select("name specialization rating workingHours");

  return sendSuccess(res, "Salon details fetched", { salon, barbers });
});