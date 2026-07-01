import type { IUser } from "../../auth/models/user.models.ts";
import type { IAuthRepository } from "../../auth/interfaces/IAuthRepository.interfaces.ts";
import type { IUserService } from "../interfaces/IUserService.interfaces.ts";

import { NotFoundError } from "../../../shared/errors/NotFoundError.errors.ts";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.errros.ts";
import { storageProvider } from "../../../shared/services/s3Storage.provider.services.ts";

// injection
import {injectable, inject} from "inversify"
import {AUTH_TYPES,LOGGER_TYPES} from "../../../DITypes/index.DITypes.ts"
import type { ILogger } from "../../../shared/interfaces/ILogger.interfaces.ts";

@injectable()
export class UserService implements IUserService {
  constructor(
   @inject(AUTH_TYPES.IAuthRepository) private _authRepository: IAuthRepository,
   @inject(LOGGER_TYPES.ILogger) private _logger: ILogger
  ) {}

  async getProfile(userId: string) {
    // log
    this._logger.info(`Fetching profile for user:" ${userId}`)

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
    delete safeData.gender;
  

    return await this._authRepository.updateProfile(userId, safeData);
  }
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this._authRepository.findByIdWithPassword(userId);
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
