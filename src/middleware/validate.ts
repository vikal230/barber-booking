import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendError } from "../utils/apiResponse.js";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg as string, 422);
  }
  next();
};

export default validate;