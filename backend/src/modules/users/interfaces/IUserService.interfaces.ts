import type { IUser } from "../../auth/models/user.models.ts";

export interface IUserService {
  getProfile(userId: string): Promise<IUser>;

  updateProfile(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null>;

  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }>;

  updateAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ profilePicture: string }>;
}
