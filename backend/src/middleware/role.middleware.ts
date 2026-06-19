import type { NextFunction, Response } from "express";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError.ts";
import { AppError } from "../shared/errors/AppError.ts";
import type { AuthRequest } from "../types/index.ts";

export const authorizeRoles = (
  ...allowedRoles: Array<"user" | "trainer" | "admin"> // convert input to array using rest operator.
) => {
  // ["admin"] or ["admin","user"] -> through rest operator.
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Required role(s): ${allowedRoles.join(", ")}. Your role: ${req.user.role}`,
        403,
      );
    }
    next();
  };
};
