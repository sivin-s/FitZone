import type { Request, Response } from "express";
import { asyncHandler } from "../../../shared/handler/asyncHandler.handler.ts";
import { ApiResponse } from "../../../shared/responses/ApiResponse.responses.ts";
import { AuthRepository } from "../repositories/auth.repositories.ts";
import { jwtService } from "../../../shared/services/jwt.services.ts";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.errros.ts";
import type { AuthPayload, AuthRequest } from "../../../types/AuthRequest.types.ts";
import User from "../models/user.models.ts";
import {
  getAccessTokenOptions,
  getRefreshTokenOptions,
} from "../../../helper/cookieConfig.helper.ts";

import type { IAuthController } from "../interfaces/IAuthController.interfaces.ts";
import type { IAuthService } from "../interfaces/IAuthService.interfaces.ts";

// injection
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../DITypes/index.DITypes.ts"

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(AUTH_TYPES.IAuthService) private _authService: IAuthService,
    @inject(AUTH_TYPES.IAuthRepository) private _authRepository: AuthRepository,
  ) { }

  register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const result = await this._authService.register(username, email, password);
    res
      .status(201)
      .json(new ApiResponse(201, result.message, { userId: result.userId }));
  });

  // Returns session info by reading only userAccessToken, and checks isBlocked status
  userMe = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.userAccessToken;
    if (!token) {
      throw new UnauthorizedError("No user session found.");
    }
    let payload: AuthPayload;
    try {
      payload = jwtService.verifyAccessToken(token) as AuthPayload;
    } catch (_error) {
      throw new UnauthorizedError("Invalid or expired user token.");
    }
    // Check if the user has been blocked since the token was issued
    const user = await User.findById(payload.userId).select("isBlocked");
    if (!user || user.isBlocked) {
      throw new UnauthorizedError("Your account has been blocked. Please contact support.");
    }
    res.status(200).json(new ApiResponse(200, "User session retrieved.", payload));
  });

  // Returns session info by reading only adminAccessToken
  adminMe = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.adminAccessToken;
    if (!token) {
      throw new UnauthorizedError("No admin session found.");
    }
    let payload: AuthPayload;
    try {
      payload = jwtService.verifyAccessToken(token) as AuthPayload;
    } catch (_error) {
      throw new UnauthorizedError("Invalid or expired admin token.");
    }
    if (payload.role !== "admin") {
      throw new UnauthorizedError("Token is not an admin token.");
    }
    res.status(200).json(new ApiResponse(200, "Admin session retrieved.", payload));
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
    } else {
      // user / trainer
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
    const isFromAdmin = req.headers.referer?.includes("/admin");
    const refreshToken = isFromAdmin
      ? (req.cookies?.adminRefreshToken || req.cookies?.userRefreshToken)
      : (req.cookies?.userRefreshToken || req.cookies?.adminRefreshToken);

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token missing. Please login again");
    }

    let payload: AuthPayload;
    try {
      payload = jwtService.verifyRefreshToken(refreshToken) as AuthPayload; // verifying refresh token
    } catch (_error) {
      // expired or tampered -> clear the cookies & reject access
      res.clearCookie("userRefreshToken", { path: "/", maxAge: 0 });
      res.clearCookie("userAccessToken", { path: "/", maxAge: 0 });
      res.clearCookie("adminRefreshToken", { path: "/", maxAge: 0 });
      res.clearCookie("adminAccessToken", { path: "/", maxAge: 0 });
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    // Check if user is blocked — blocked users cannot get a new access token
    const dbUser = await User.findById(payload.userId).select("isBlocked");
    if (!dbUser || dbUser.isBlocked) {
      res.clearCookie("userRefreshToken", { path: "/", maxAge: 0 });
      res.clearCookie("userAccessToken", { path: "/", maxAge: 0 });
      throw new UnauthorizedError("Your account has been blocked. Please contact support.");
    }

    const role = payload?.role;
    const accessTokenKey =
      role === "admin" ? "adminAccessToken" : "userAccessToken"; // dynamically creating access token key(name).

    // generate a brand new access token
    // notice rm the 'exp' from decode jwt token it creates conflict during regenerate token.
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
    // clear all tokens from cookies
    res.clearCookie("userAccessToken", { path: "/" });
    res.clearCookie("userRefreshToken", { path: "/" });
    res.clearCookie("adminAccessToken", { path: "/" });
    res.clearCookie("adminRefreshToken", { path: "/" });
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
