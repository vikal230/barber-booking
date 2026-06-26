import { Request, Response, NextFunction } from "express";

type AsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

const asyncHandler = (fn: AsyncFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default asyncHandler;