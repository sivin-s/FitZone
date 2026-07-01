import type { RequestHandler } from "express";

export interface IUserController {
  getProfile: RequestHandler;
  updateProfile: RequestHandler;
  changePassword: RequestHandler;
  updateAvatar: RequestHandler;
}
