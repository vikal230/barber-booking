import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../services/token.service.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return sendError(res, "Email already registered", 400);

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, phone, email, password: hashed, role });

  return sendSuccess(res, "Registered successfully", { id: user._id }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return sendError(res, "Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return sendError(res, "Invalid credentials", 401);

  const payload = {
    userId: String(user._id),
    salonId: user.salonId ? String(user.salonId) : undefined,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return sendSuccess(res, "Login successful", { accessToken, refreshToken });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return sendError(res, "Refresh token missing", 400);

  const decoded = verifyRefreshToken(token);
  const accessToken = generateAccessToken(decoded);

  return sendSuccess(res, "Token refreshed", { accessToken });
});