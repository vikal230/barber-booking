import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";
import { sendError } from "../utils/apiResponse.js";

const tenantMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const salonId = req.headers["x-salon-id"] as string;

  if (!salonId) return sendError(res, "Tenant identification missing", 400);

  if (req.salonId && req.salonId !== salonId) {
    return sendError(res, "Access denied to this salon", 403);
  }

  req.salonId = salonId;
  next();
};

export default tenantMiddleware;