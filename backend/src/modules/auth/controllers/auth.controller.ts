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

// injection
import {injectable, inject} from "inversify";
import {TYPES} from "../types/types.ts"

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.IAuthService) private _authService: IAuthService,
    @inject(TYPES.IAuthRepository) private _authRepository: AuthRepository,
  ) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const result = await this._authService.register(username, email, password);
    res
      .status(201)
      .json(new ApiResponse(201, result.message, { userId: result.userId }));
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await this._authService.verifyOtp(email, otp);

    const user = await this._authRepository.findByEmail(email);
    if (user) {
      const payload: AuthPayload = {
        userId: user._id.toString(),
        role: user.role,
      };
      const accessToken = jwtService.generateAccessToken(payload);
      const refreshToken = jwtService.generateRefreshToken(payload);
      // set tokens in cookie
      res.cookie("userAccessToken", accessToken, getAccessTokenOptions());
      res.cookie("userRefreshToken", refreshToken, getRefreshTokenOptions());
    }
    res.status(200).json(new ApiResponse(200, result.message));
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await this._authService.resendOtp(email);
    res.status(200).json(new ApiResponse(200, result.message));
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this._authService.login(email, password);

    //set tokens in cookie
    // res.cookie("accessToken", result.accessToken, getAccessTokenOptions());
    // res.cookie("refreshToken", result.refreshToken, getRefreshTokenOptions());

    if (result?.user?.role === "admin") {
      // admin cookie
      res.cookie(
        "adminAccessToken",
        result.accessToken,
        getAccessTokenOptions(),
      );
      res.cookie(
        "adminRefreshToken",
        result.refreshToken,
        getRefreshTokenOptions(),
      );
    } else if (result.user.role === "user") {
      // user
      res.cookie(
        "userAccessToken",
        result.accessToken,
        getAccessTokenOptions(),
      );
      res.cookie(
        "userRefreshToken",
        result.refreshToken,
        getRefreshTokenOptions(),
      );
    }

    res
      .status(200)
      .json(new ApiResponse(200, result.message, { user: result.user }));
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    //notice: /refresh-token
    const userRefreshToken = req.cookies?.userRefreshToken;
    const adminRefreshToken = req.cookies?.adminRefreshToken;

    const refreshToken = userRefreshToken || adminRefreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token missing. Please login again");
    }

    let payload: AuthPayload;
    try {
      payload = jwtService.verifyRefreshToken(refreshToken) as AuthPayload; // verifying refresh token
    } catch (_error) {
      // expired or tampered -> clear the cookies & reject access
      res.clearCookie("userRefreshToken", { path: "/", expires: new Date(0) });
      res.clearCookie("userAccessToken", { path: "/", expires: new Date(0) });
      res.clearCookie("adminRefreshToken", { path: "/", expires: new Date(0) });
      res.clearCookie("adminAccessToken", { path: "/", expires: new Date(0) });
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const role = payload?.role;
    const accessTokenKey =
      role === "admin" ? "adminAccessToken" : "userAccessToken"; // dynamically creating access token key(name).

    // generate a brand new access token
    const newAccessToken = jwtService.generateAccessToken(payload);
    res.cookie(accessTokenKey, newAccessToken, getAccessTokenOptions());
    res
      .status(200)
      .json(new ApiResponse(200, "Access token refreshed successfully"));
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await this._authService.forgotPassword(email);
    res.status(200).json(new ApiResponse(200, result.message));
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const result = await this._authService.resetPassword(
      email,
      otp,
      newPassword,
    );
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
    const result = await this._authService.googleAuth(idToken);

    res.cookie("userAccessToken", result.accessToken, getAccessTokenOptions());
    res.cookie(
      "userRefreshToken",
      result.refreshToken,
      getRefreshTokenOptions(),
    );

    res
      .status(200)
      .json(new ApiResponse(200, result.message, { user: result.user }));
  });
}

// instance creation -> dependencies
// const authRepository = new AuthRepository();
// const authService = new AuthService(authRepository);
// export const authController = new AuthController(authService, authRepository);
