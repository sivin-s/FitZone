import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.ts";
import type { AuthPayload } from "../../types/AuthRequest.types.ts";
import type { IJwtService } from "../interfaces/IJwtService.ts";
class JwtService implements IJwtService {
  generateAccessToken(payload: AuthPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    } as SignOptions);
  }
  generateRefreshToken(payload: AuthPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions);
  }
  verifyAccessToken(token: string): AuthPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload; // returns decoded result
  }
  verifyRefreshToken(token: string): AuthPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload;
  }
}

export const jwtService = new JwtService();
