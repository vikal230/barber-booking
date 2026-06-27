// import { Response } from "express";
// import Booking from "../models/Booking.js";
// import Barber from "../models/Barber.js";
// import { AuthRequest } from "../middleware/authMiddleware.js";
// import { sendSuccess, sendError } from "../utils/apiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";

// export const updateAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const { isAvailable } = req.body;

//   const barber = await Barber.findOneAndUpdate(
//     { userId: req.userId },
//     { isAvailable },
//     { new: true }
//   );

//   if (!barber) return sendError(res, "Barber not found", 404);
//   return sendSuccess(res, "Availability updated", barber);
// });


// export const getMySchedule = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const barber = await Barber.findOne({ userId: req.userId });
//   if (!barber) return sendError(res, "Barber not found", 404);

//   const { date, startDate, endDate } = req.query;

//   const filter: Record<string, unknown> = {
//     barberId: barber._id,
//     status: { $nin: ["cancelled"] },
//   };

//   if (date) {
//     // Single date
//     filter.date = date;
//   } else if (startDate && endDate) {
//     // Date range
//     filter.date = { $gte: startDate, $lte: endDate };
//   } else {
//     // Default: aaj
//     filter.date = new Date().toISOString().split("T")[0];
//   }

//   const bookings = await Booking.find(filter)
//     .populate("customerId", "name phone")
//     .populate("serviceId", "name duration price")
//     .sort({ date: -1, "slot.start": 1 });

//   return sendSuccess(res, "Schedule fetched", { barber, bookings });
// });


import { Response } from "express";
import Booking from "../models/Booking.js";
import Barber from "../models/Barber.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMySchedule = asyncHandler(async (req: AuthRequest, res: Response) => {
  const barber = await Barber.findOne({ userId: req.userId });
  if (!barber) return sendError(res, "Barber not found", 404);

  const { date, startDate, endDate } = req.query;

  const filter: Record<string, unknown> = {
    barberId: barber._id,
    status: { $nin: ["cancelled"] },
  };

  if (date) {
    filter.date = date;
  } else if (startDate && endDate) {
    filter.date = { $gte: startDate, $lte: endDate };
  } else {
    filter.date = new Date().toISOString().split("T")[0];
  }

  const bookings = await Booking.find(filter)
    .populate("customerId", "name phone")
    .populate("serviceId", "name duration price")
    .sort({ date: -1, "slot.start": 1 });

  return sendSuccess(res, "Schedule fetched", { barber, bookings });
});

export const updateAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { isAvailable } = req.body;
  const barber = await Barber.findOneAndUpdate(
    { userId: req.userId },
    { isAvailable },
    { new: true }
  );
  if (!barber) return sendError(res, "Barber not found", 404);
  return sendSuccess(res, "Availability updated", barber);
});