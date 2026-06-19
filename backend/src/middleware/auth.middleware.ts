import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../shared/handlers/asyncHandler.ts";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError.ts";
import { jwtService } from "../shared/services/jwt.service.ts";
import type { AuthRequest, AuthPayload } from "../types/index.ts";

const extractToken = (req: Request): string | null => {
  const cookieToken = req.cookies?.accessToken;
  if (typeof cookieToken === "string" && cookieToken.trim() !== "") {
    return cookieToken;
  }
  return null;
};

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError(
        "Access denied. No token provided. Please login.",
      );
    }
    // verify jwt signature & expiration
    let payload: AuthPayload;
    try {
      payload = jwtService.verifyAccessToken(token) as AuthPayload;
    } catch (_error) {
      throw new UnauthorizedError("Invalid or expired access token.");
    }
    req.user = payload;
    next();
  },
);
