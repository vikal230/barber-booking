
// import { Response } from "express";
// import Salon from "../models/Salon.js";
// import User from "../models/User.js";
// import Booking from "../models/Booking.js";
// import { AuthRequest } from "../middleware/authMiddleware.js";
// import { sendSuccess, sendError } from "../utils/apiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";

// export const createSalon = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const { businessName, subdomain } = req.body;

//   const exists = await Salon.findOne({ subdomain });
//   if (exists) return sendError(res, "Subdomain already taken", 400);

//   const salon = await Salon.create({
//     businessName,
//     subdomain,
//     ownerId: req.userId,
//     status: "trial",
//   });

//   await User.findByIdAndUpdate(req.userId, { salonId: salon._id });
//   return sendSuccess(res, "Salon created successfully", salon, 201);
// });

// export const getSalon = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const salon = await Salon.findById(req.salonId);
//   if (!salon) return sendError(res, "Salon not found", 404);
//   return sendSuccess(res, "Salon fetched", salon);
// });

// export const getSalonStats = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const now = new Date();

//   const [totalBookings, confirmedBookings, cancelledBookings] = await Promise.all([
//     Booking.countDocuments({ salonId: req.salonId }),
//     Booking.countDocuments({ salonId: req.salonId, status: "confirmed" }),
//     Booking.countDocuments({ salonId: req.salonId, status: "cancelled" }),
//   ]);

//   // Last 7 days bookings
//   const weeklyBookings = await Promise.all(
//     Array.from({ length: 7 }, (_, i) => {
//       const date = new Date(now);
//       date.setDate(now.getDate() - i);
//       const dateStr = date.toISOString().split("T")[0];
//       const label = date.toLocaleDateString("default", { weekday: "short" });
//       return Booking.countDocuments({
//         salonId: req.salonId,
//         date: dateStr,
//         status: "confirmed",
//       }).then((count) => ({ day: label, count }));
//     })
//   );

//   // Last 6 months
//   const monthlyBookings = await Promise.all(
//     Array.from({ length: 6 }, (_, i) => {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
//       const month = date.toLocaleString("default", { month: "short" });
//       return Booking.countDocuments({
//         salonId: req.salonId,
//         status: "confirmed",
//         createdAt: { $gte: date, $lt: nextDate },
//       }).then((count) => ({ month, count }));
//     })
//   );

//   return sendSuccess(res, "Salon stats", {
//     totalBookings,
//     confirmedBookings,
//     cancelledBookings,
//     weeklyBookings: weeklyBookings.reverse(),
//     monthlyBookings: monthlyBookings.reverse(),
//   });
// });


// export const getTodayBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const today = new Date().toISOString().split("T")[0];

//   const bookings = await Booking.find({
//     salonId: req.salonId,
//     date: today,
//     status: { $nin: ["cancelled"] },
//   })
//     .populate("customerId", "name phone")
//     .populate("barberId", "name")
//     .populate("serviceId", "name price duration")
//     .sort({ "slot.start": 1 });

//   return sendSuccess(res, "Today bookings fetched", bookings);
// });


import { Response } from "express";
import Salon from "../models/Salon.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createSalon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { businessName, subdomain } = req.body;
  const exists = await Salon.findOne({ subdomain });
  if (exists) return sendError(res, "Subdomain already taken", 400);
  const salon = await Salon.create({
    businessName, subdomain, ownerId: req.userId, status: "trial",
  });
  await User.findByIdAndUpdate(req.userId, { salonId: salon._id });
  return sendSuccess(res, "Salon created successfully", salon, 201);
});

export const getSalon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const salon = await Salon.findById(req.salonId);
  if (!salon) return sendError(res, "Salon not found", 404);
  return sendSuccess(res, "Salon fetched", salon);
});

export const getSalonStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const now = new Date();

  const [totalBookings, confirmedBookings, cancelledBookings] = await Promise.all([
    Booking.countDocuments({ salonId: req.salonId }),
    Booking.countDocuments({ salonId: req.salonId, status: "confirmed" }),
    Booking.countDocuments({ salonId: req.salonId, status: "cancelled" }),
  ]);

  const weeklyBookings = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const label = date.toLocaleDateString("default", { weekday: "short" });
      return Booking.countDocuments({
        salonId: req.salonId, date: dateStr, status: "confirmed",
      }).then((count) => ({ day: label, count }));
    })
  );

  const monthlyBookings = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const month = date.toLocaleString("default", { month: "short" });
      return Booking.countDocuments({
        salonId: req.salonId, status: "confirmed",
        createdAt: { $gte: date, $lt: nextDate },
      }).then((count) => ({ month, count }));
    })
  );

  return sendSuccess(res, "Salon stats", {
    totalBookings, confirmedBookings, cancelledBookings,
    weeklyBookings: weeklyBookings.reverse(),
    monthlyBookings: monthlyBookings.reverse(),
  });
});

export const getTodayBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const today = new Date().toISOString().split("T")[0];
  const bookings = await Booking.find({
    salonId: req.salonId,
    date: today,
    status: { $nin: ["cancelled"] },
  })
    .populate("customerId", "name phone")
    .populate("barberId", "name")
    .populate("serviceId", "name price duration")
    .sort({ "slot.start": 1 });
  return sendSuccess(res, "Today bookings fetched", bookings);
});