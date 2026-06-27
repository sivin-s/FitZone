import type { NextFunction, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError.ts";
import { AppError } from "../errors/AppError.ts";
import type { AuthRequest } from "../../types/AuthRequest.types.ts";

export const authorizeRoles = (
  ...allowedRoles: Array<"user" | "trainer" | "admin"> // gets [] convert input to array using rest operator.
) => {
  // ["admin"] or ["admin","user"] -> through rest operator.
  return (req: AuthRequest, res: Response, next: NextFunction) => {  // this cb get execute after auth middleware (so req.user is always present).
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
