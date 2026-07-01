import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../handler/asyncHandler.handler.ts";
import { UnauthorizedError } from "../errors/UnauthorizedError.errros.ts";
import { jwtService } from "../services/jwt.services.ts";
import type { AuthRequest, AuthPayload } from "../../types/AuthRequest.types.ts";
import User from "../../modules/auth/models/user.models.ts";

//logger not di
import {logger} from '../../config/logger.config.ts'

const extractToken = (req: Request): string | null => {
  const isFromAdmin = req.headers.referer?.includes("/admin");
  const cookieToken = isFromAdmin
    ? (req.cookies?.adminAccessToken || req.cookies?.userAccessToken)
    : (req.cookies?.userAccessToken || req.cookies?.adminAccessToken);

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

    // Check if user is blocked in the database (JWT alone doesn't reflect this)
    const user = await User.findById(payload.userId).select("isBlocked");
    if (!user) {
      throw new UnauthorizedError("User account not found.");
    }
    if (user.isBlocked) {
      throw new UnauthorizedError("Your account has been blocked. Please contact support.");
    }

    logger.debug("payload >>", payload)
    req.user = payload;
    next();
  },
);
