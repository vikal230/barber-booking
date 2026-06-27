// import { Response } from "express";
// import Barber from "../models/Barber.js";
// import User from "../models/User.js";
// import { AuthRequest } from "../middleware/authMiddleware.js";
// import { sendSuccess, sendError } from "../utils/apiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";

// export const addBarber = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const { name, phone, email, password, specialization, workingHours, breakTimes } = req.body;
// // console.log("Body:", req.body);
// // console.log("SalonId:", req.salonId);
// // console.log("UserId:", req.userId);

//   const exists = await User.findOne({ email });
//   if (exists) return sendError(res, "Email already registered", 400);

//   const user = await User.create({
//     name,
//     phone,
//     email,
//     password,
//     role: "barber",
//     salonId: req.salonId,
//   });

//   const barber = await Barber.create({
//     salonId: req.salonId,
//     userId: user._id,
//     name,
//     specialization,
//     workingHours,
//     breakTimes,
//   });

//   return sendSuccess(res, "Barber added", barber, 201);
// });

// export const getBarbers = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const barbers = await Barber.find({ salonId: req.salonId, isAvailable: true });
//   return sendSuccess(res, "Barbers fetched", barbers);
// });

// export const updateBarber = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const barber = await Barber.findOneAndUpdate(
//     { _id: req.params.id, hhmsalonId: req.salonId },
//     req.body,
//     { new: true }
//   );

//   if (!barber) return sendError(res, "Barber not found", 404);
//   return sendSuccess(res, "Barber updated", barber);
// });



import { Response } from "express";
import Barber from "../models/Barber.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addBarber = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log("Body:", req.body);
  console.log("SalonId:", req.salonId);
  console.log("UserId:", req.userId);

  const { name, phone, email, password, specialization, workingHours, breakTimes } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return sendError(res, "Email already registered", 400);

  const user = await User.create({
    name, phone, email, password,
    role: "barber",
    salonId: req.salonId,
  });

  const barber = await Barber.create({
    salonId: req.salonId,
    userId: user._id,
    name, specialization, workingHours, breakTimes,
  });

  return sendSuccess(res, "Barber added", barber, 201);
});

export const getBarbers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const barbers = await Barber.find({ salonId: req.salonId });
  return sendSuccess(res, "Barbers fetched", barbers);
});

export const updateBarber = asyncHandler(async (req: AuthRequest, res: Response) => {
  const barber = await Barber.findOneAndUpdate(
    { _id: req.params.id, salonId: req.salonId },
    req.body,
    { new: true }
  );
  if (!barber) return sendError(res, "Barber not found", 404);
  return sendSuccess(res, "Barber updated", barber);
});

export const deactivateBarber = asyncHandler(async (req: AuthRequest, res: Response) => {
  const barber = await Barber.findOneAndUpdate(
    { _id: req.params.id, salonId: req.salonId },
    { isAvailable: false },
    { new: true }
  );
  if (!barber) return sendError(res, "Barber not found", 404);

  // Future bookings cancel karo
  await Booking.updateMany(
    {
      barberId: req.params.id,
      salonId: req.salonId,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: new Date().toISOString().split("T")[0] },
    },
    { status: "cancelled" }
  );

  return sendSuccess(res, "Barber deactivated and bookings cancelled", barber);
});

export const deleteBarber = asyncHandler(async (req: AuthRequest, res: Response) => {
  const barber = await Barber.findOne({ _id: req.params.id, salonId: req.salonId });
  if (!barber) return sendError(res, "Barber not found", 404);

  // Future bookings cancel karo
  await Booking.updateMany(
    {
      barberId: req.params.id,
      salonId: req.salonId,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: new Date().toISOString().split("T")[0] },
    },
    { status: "cancelled" }
  );

  // User bhi delete karo
  await User.findByIdAndDelete(barber.userId);
  await Barber.findByIdAndDelete(req.params.id);

  return sendSuccess(res, "Barber deleted successfully");
});