import User, { type IUser } from "../models/user.model.ts";
import type { IAuthRepository } from "../interfaces/IAuthRepository.ts";

export class AuthRepository implements IAuthRepository {
  async findById(id: string, selectPassword?: boolean): Promise<IUser | null> {
    const query = User.findById(id);
    if (selectPassword) {
      query.select("+password");
    }
    return await query;
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }
  async create(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData);
  }
  async updateVerificationStatus(
    userId: string,
    isVerified: boolean,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { isVerified }, // updating data
      { new: true, runValidators: true },
    );
  }
  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<IUser | null> {
    const user = await User.findById(userId).select("+password");
    if (!user) return null;
    user.password = newPassword;
    await user.save();
    return user;
  }
  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await User.findOne({ googleId });
  }
  async linkGoogleId(userId: string, googleId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { googleId, isVerified: true }, // update
      { new: true, runValidators: true },
    );
  }

  async updateProfile(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateAvatar(
    userId: string,
    profilePicture: string,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { profilePicture }, // update data
      { new: true, runValidators: true },
    );
  }
}
