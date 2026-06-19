import type { IUser } from "../models/user.model.ts";

export interface IAuthRepository {
  // auth methods
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string, selectPassword?: boolean): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  updateVerificationStatus(
    userId: string,
    isVerified: boolean,
  ): Promise<IUser | null>;
  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;

  // google auth methods
  findByGoogleId(googleId: string): Promise<IUser | null>;
  linkGoogleId(userId: string, googleId: string): Promise<IUser | null>;

  // profile methods
  updateProfile(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null>;
  updateAvatar(userId: string, profilePicture: string): Promise<IUser | null>;
}
