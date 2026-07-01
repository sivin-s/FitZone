import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/NotFoundError.errors";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
};
