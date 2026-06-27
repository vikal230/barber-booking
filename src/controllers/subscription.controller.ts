import { Response } from "express";
import razorpay from "../config/razorpay.js";
import Salon from "../models/Salon.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculatePrice, CHAIR_PRICING, type BillingCycle } from "../config/plans.js";
import crypto from "crypto";

// Plans get karo — price dynamically calculate hogi
export const getPlans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const salon = await Salon.findById(req.salonId);
  if (!salon) return sendError(res, "Salon not found", 404);

  const chairs = salon.chairs;

  const plans = {
    monthly: {
      name: "Monthly",
      chairs,
      price: calculatePrice(chairs, "monthly"),
      durationDays: 30,
      cycle: "monthly",
    },
    halfYearly: {
      name: "6 Months",
      chairs,
      price: calculatePrice(chairs, "halfYearly"),
      durationDays: 180,
      cycle: "halfYearly",
    },
    yearly: {
      name: "Yearly",
      chairs,
      price: calculatePrice(chairs, "yearly"),
      durationDays: 365,
      cycle: "yearly",
    },
  };

  return sendSuccess(res, "Plans fetched", {
    chairs,
    trialExpiresAt: salon.subscription.expiresAt,
    currentPlan: salon.subscription.planId,
    plans,
  });
});

// Subscription order create karo
export const createSubscriptionOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cycle } = req.body as { cycle: BillingCycle };

  const salon = await Salon.findById(req.salonId);
  if (!salon) return sendError(res, "Salon not found", 404);

  const amount = calculatePrice(salon.chairs, cycle);
  if (amount === -1) return sendError(res, "8+ chairs ke liye contact karein", 400);

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `sub_${req.salonId}_${Date.now()}`,
    notes: {
      salonId: req.salonId!,
      cycle,
      chairs: salon.chairs,
    },
  });

  return sendSuccess(res, "Subscription order created", {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    cycle,
    chairs: salon.chairs,
  });
});

// Payment verify karo aur subscription activate karo
export const verifySubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cycle } = req.body as {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    cycle: BillingCycle;
  };

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return sendError(res, "Payment verification failed", 400);
  }

  const durationMap = { monthly: 30, halfYearly: 180, yearly: 365 };
  const days = durationMap[cycle];
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const salon = await Salon.findByIdAndUpdate(
    req.salonId,
    {
      status: "active",
      "subscription.planId": cycle,
      "subscription.cycle": cycle,
      "subscription.expiresAt": expiresAt,
      "subscription.autoRenew": true,
    },
    { new: true }
  );

  return sendSuccess(res, "Subscription activated!", salon);
});

// Chairs update karo
export const updateChairs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { chairs } = req.body;

  if (chairs < 1) return sendError(res, "Minimum 1 chair honi chahiye", 400);

  const salon = await Salon.findByIdAndUpdate(
    req.salonId,
    { chairs },
    { new: true }
  );

  if (!salon) return sendError(res, "Salon not found", 404);
  return sendSuccess(res, "Chairs updated", salon);
});