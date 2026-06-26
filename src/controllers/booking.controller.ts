import { Response } from "express";
import Booking from "../models/Booking.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getAvailableSlots } from "../services/slot.service.js";
import {
  lockSlot,
  releaseSlot,
  isSlotLocked,
} from "../services/lock.service.js";
import {
  emitNewBooking,
  emitBookingCancelled,
} from "../services/socket.service.js";

export const getSlots = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { barberId, date, duration } = req.query;

    const slots = await getAvailableSlots(
      barberId as string,
      date as string,
      Number(duration),
    );

    return sendSuccess(res, "Slots fetched", slots);
  },
);

export const lockBookingSlot = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { barberId, date, slot } = req.body;

    const locked = await isSlotLocked(barberId, date, slot);
    if (locked) return sendError(res, "Slot is temporarily blocked", 409);

    const success = await lockSlot(barberId, date, slot);
    if (!success) return sendError(res, "Could not lock slot, try again", 409);

    return sendSuccess(res, "Slot locked for 10 minutes");
  },
);

export const confirmBooking = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { barberId, serviceId, date, slot } = req.body;

    const locked = await isSlotLocked(barberId, date, slot.start);
    if (!locked) return sendError(res, "Slot lock expired, try again", 409);

    const booking = await Booking.create({
      salonId: req.salonId,
      customerId: req.userId,
      barberId,
      serviceId,
      date,
      slot,
      status: "confirmed",
      paymentStatus: "unpaid",
    });

    await releaseSlot(barberId, date, slot.start);
    emitNewBooking(req.salonId!, booking);

    return sendSuccess(res, "Booking confirmed", booking, 201);
  },
);

export const getMyBookings = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const bookings = await Booking.find({ customerId: req.userId })
      .populate("barberId", "name")
      .populate("serviceId", "name price")
      .sort({ createdAt: -1 });

    return sendSuccess(res, "Bookings fetched", bookings);
  },
);

export const cancelBooking = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customerId: req.userId },
      { status: "cancelled" },
      { new: true },
    );

    if (!booking) return sendError(res, "Booking not found", 404);

    emitBookingCancelled(booking.salonId.toString(), booking._id.toString());

    return sendSuccess(res, "Booking cancelled", booking);
  },
);
