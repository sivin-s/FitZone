import type { IBaseRepository } from "../../../common/interfaces/IBaseRepository.ts";
import type { IUser } from "../models/user.model.ts";

export interface IAuthRepository extends IBaseRepository<IUser> {
  // auth methods - non crud methods

  findByEmail(email: string):Promise<IUser | null>;

  findByIdWithPassword(id: string): Promise<IUser | null>;

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
