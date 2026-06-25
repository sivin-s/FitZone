import type { IUser } from "../../auth/models/user.model.ts";
import type { IAuthRepository } from "../../auth/interfaces/IAuthRepository.ts";
import type { IUserService } from "../interfaces/IUserService.ts";

import { NotFoundError } from "../../../shared/errors/NotFoundError.ts";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.ts";
import { storageProvider } from "../../../shared/services/s3Storage.provider.ts";

// injection
import {injectable, inject} from "inversify"
import {TYPES} from "../../auth/types/types.ts" // auth 

@injectable()
export class UserService implements IUserService {
  constructor(
   @inject(TYPES.IAuthRepository) private _authRepository: IAuthRepository
  ) {}

  async getProfile(userId: string) {
    const user = await this._authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
  async updateProfile(userId: string, updateData: Partial<IUser>) {
    const user = await this._authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    // prevent users from updating sensitive fields via this endpoint
    const safeData = { ...updateData };
    delete safeData.password;
    delete safeData.role;
    delete safeData.isBlocked;
    delete safeData.isVerified;
    delete safeData.googleId;

    if (safeData.gender === "" || safeData.gender === null) {
      delete safeData.gender;
    }

    return await this._authRepository.updateProfile(userId, safeData);
  }
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this._authRepository.findById(userId, true);
    if (!user) throw new NotFoundError("User not found");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new UnauthorizedError("Current password is incorrect");

    await this._authRepository.updatePassword(userId, newPassword);
    return { message: "Password changed successfully" };
  }
  async updateAvatar(userId: string, file: Express.Multer.File) {
    const user = await this._authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const newAvatarUrl = await storageProvider.uploadFile(file, "avatars");

    if (user.profilePicture && user.profilePicture.includes("amazonaws.com")) {
      await storageProvider.deleteFile(user.profilePicture);
    }
    await this._authRepository.updateAvatar(userId, newAvatarUrl); // update db with new URL
    return { profilePicture: newAvatarUrl };
  }
}
