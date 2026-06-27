import { Response } from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Booking from "../models/Booking.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Step 1: Order create karo
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { amount, bookingId } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100, // paise mein
    currency: "INR",
    receipt: `booking_${bookingId}`,
    notes: {
      bookingId,
      userId: req.userId!,
    },
  });

  return sendSuccess(res, "Order created", {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// Step 2: Payment verify karo
export const verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  // Signature verify karo
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return sendError(res, "Payment verification failed", 400);
  }

  // Booking update karo
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      paymentStatus: "paid",
      status: "confirmed",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    },
    { new: true }
  );

  if (!booking) return sendError(res, "Booking not found", 404);

  return sendSuccess(res, "Payment verified successfully", booking);
});

// Step 3: Refund karo (cancel hone par)
export const refundPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return sendError(res, "Booking not found", 404);
  if (booking.paymentStatus !== "paid") return sendError(res, "Payment not done", 400);

  await razorpay.payments.refund(booking.paymentId as string, {
    amount: undefined, // full refund
  });

  await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "refunded", status: "cancelled" });

  return sendSuccess(res, "Refund initiated successfully");
});