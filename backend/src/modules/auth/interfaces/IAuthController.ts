import type { RequestHandler } from "express";

export interface IAuthController {
  register: RequestHandler;
  verifyOtp: RequestHandler;
  resendOtp: RequestHandler;
  login: RequestHandler;
  refreshToken: RequestHandler;
  forgotPassword: RequestHandler;
  resetPassword: RequestHandler;
  logout: RequestHandler;
  googleAuth: RequestHandler;
}
