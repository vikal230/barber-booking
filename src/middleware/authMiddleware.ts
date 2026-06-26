import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse.js";

export interface AuthRequest extends Request {
  userId?: string;
  salonId?: string;
  role?: "super_admin" | "salon_owner" | "barber" | "customer";
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return sendError(res, "Unauthorized", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest;
    req.userId = decoded.userId;
    req.salonId = decoded.salonId;
    req.role = decoded.role;
    next();
  } catch {
    return sendError(res, "Invalid token", 401);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.role!)) {
      return sendError(res, "Access denied", 403);
    }
    next();
  };
};