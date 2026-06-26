import { Response } from "express";
import Service from "../models/Service.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, price, duration } = req.body;

  const service = await Service.create({
    salonId: req.salonId,
    name,
    price,
    duration,
  });

  return sendSuccess(res, "Service created", service, 201);
});

export const getServices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const services = await Service.find({ salonId: req.salonId, isActive: true });
  return sendSuccess(res, "Services fetched", services);
});

export const deleteService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, salonId: req.salonId },
    { isActive: false },
    { new: true }
  );

  if (!service) return sendError(res, "Service not found", 404);
  return sendSuccess(res, "Service deleted");
});