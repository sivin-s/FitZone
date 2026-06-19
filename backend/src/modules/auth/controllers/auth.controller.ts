import type { Request, Response } from "express";
import { asyncHandler } from "../../../shared/handlers/asyncHandler.ts";
import { ApiResponse } from "../../../shared/responses/ApiResponse.ts";
import { AuthService } from "../services/auth.service.ts";
import { AuthRepository } from "../repositories/auth.repository.ts";
import { jwtService } from "../../../shared/services/jwt.service.ts";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.ts";
import type { AuthPayload } from "../../../types/index.ts";
import {
  getAccessTokenOptions,
  getRefreshTokenOptions,
} from "../../../helper/cookieConfigHelper.ts";

import type { IAuthController } from "../interfaces/IAuthController.ts";
import type { IAuthService } from "../interfaces/IAuthService.ts";

export class AuthController implements IAuthController {
  constructor(
    private authService: IAuthService,
    private authRepository: AuthRepository,
  ) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const result = await authService.register(username, email, password);
    res
      .status(201)
      .json(new ApiResponse(201, result.message, { userId: result.userId }));
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);

    const user = await authRepository.findByEmail(email);
    if (user) {
      const payload: AuthPayload = {
        userId: user._id.toString(),
        role: user.role,
      };
      const accessToken = jwtService.generateAccessToken(payload);
      const refreshToken = jwtService.generateRefreshToken(payload);
      // set tokens in cookie
      res.cookie("accessToken", accessToken, getAccessTokenOptions());
      res.cookie("refreshToken", refreshToken, getRefreshTokenOptions());
    }
    res.status(200).json(new ApiResponse(200, result.message));
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendOtp(email);
    res.status(200).json(new ApiResponse(200, result.message));
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    //set tokens in cookie
    res.cookie("accessToken", result.accessToken, getAccessTokenOptions());
    res.cookie("refreshToken", result.refreshToken, getRefreshTokenOptions());

    res
      .status(200)
      .json(new ApiResponse(200, result.message, { user: result.user }));
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    //notice: /refresh-token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token missing. Please login again");
    }
    let payload: AuthPayload;
    try {
      payload = jwtService.verifyRefreshToken(refreshToken) as AuthPayload; // verifying refresh token
    } catch (_error) {
      // expired or tampered -> clear the cookies & reject access
      res.clearCookie("refreshToken", { path: "/" });
      res.clearCookie("accessToken", { path: "/" });
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
    // generate a brand new access token
    const newAccessToken = jwtService.generateAccessToken(payload);
    res.cookie("accessToken", newAccessToken, getAccessTokenOptions());
    res
      .status(200)
      .json(new ApiResponse(200, "Access token refreshed successfully"));
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(new ApiResponse(200, result.message));
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);
    res.status(200).json(new ApiResponse(200, result.message));
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    // clear all token from cookie
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToke", { path: "/" });
    res.status(200).json(new ApiResponse(200, "Logged out successfully."));
  });

  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;
    const result = await authService.googleAuth(idToken);

    res.cookie("accessToken", result.accessToken, getAccessTokenOptions());
    res.cookie("refreshToken", result.refreshToken, getRefreshTokenOptions());

    res
      .status(200)
      .json(new ApiResponse(200, result.message, { user: result.user }));
  });
}

// instance creation -> dependencies
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
export const authController = new AuthController(authService, authRepository);
