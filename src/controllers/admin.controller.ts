// import { Response } from "express";
// import Salon from "../models/Salon.js";
// import User from "../models/User.js";
// import Booking from "../models/Booking.js";
// import { AuthRequest } from "../middleware/authMiddleware.js";
// import { sendSuccess, sendError } from "../utils/apiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";

// export const getAllSalons = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const salons = await Salon.find().populate("ownerId", "name email phone");
//   return sendSuccess(res, "Salons fetched", salons);
// });

// export const updateSalonStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const { status } = req.body;

//   const salon = await Salon.findByIdAndUpdate(
//     req.params.id,
//     { status },
//     { new: true }
//   );

//   if (!salon) return sendError(res, "Salon not found", 404);
//   return sendSuccess(res, "Salon status updated", salon);
// });

// export const getPlatformStats = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const [totalSalons, totalUsers, totalBookings] = await Promise.all([
//     Salon.countDocuments(),
//     User.countDocuments(),
//     Booking.countDocuments({ status: "confirmed" }),
//   ]);

//   return sendSuccess(res, "Platform stats", {
//     totalSalons,
//     totalUsers,
//     totalBookings,
//   });
// });



import { Response } from "express";
import Salon from "../models/Salon.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllSalons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const salons = await Salon.find().populate("ownerId", "name email phone");
  return sendSuccess(res, "Salons fetched", salons);
});

export const updateSalonStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const salon = await Salon.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!salon) return sendError(res, "Salon not found", 404);
  return sendSuccess(res, "Salon status updated", salon);
});

export const getPlatformStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const now = new Date();

  const [totalSalons, totalUsers, totalBookings, activeSalons, trialSalons, suspendedSalons] =
    await Promise.all([
      Salon.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments({ status: "confirmed" }),
      Salon.countDocuments({ status: "active" }),
      Salon.countDocuments({ status: "trial" }),
      Salon.countDocuments({ status: "suspended" }),
    ]);

  // Last 6 months bookings
  const monthlyBookings = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const month = date.toLocaleString("default", { month: "short" });
      return Booking.countDocuments({
        status: "confirmed",
        createdAt: { $gte: date, $lt: nextDate },
      }).then((count) => ({ month, count }));
    })
  );

  // Last 6 months salons
  const monthlySalons = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const month = date.toLocaleString("default", { month: "short" });
      return Salon.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
      }).then((count) => ({ month, count }));
    })
  );

  return sendSuccess(res, "Platform stats", {
    totalSalons,
    totalUsers,
    totalBookings,
    activeSalons,
    trialSalons,
    suspendedSalons,
    monthlyBookings: monthlyBookings.reverse(),
    monthlySalons: monthlySalons.reverse(),
  });
});