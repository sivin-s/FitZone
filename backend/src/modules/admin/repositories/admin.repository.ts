import User, { type IUser } from "../../auth/models/user.model.ts";
import type { IAdminRepository } from "../interfaces/IAdminRepository.ts";
import { storageProvider } from "../../../shared/services/s3Storage.provider.ts";

export class AdminRepository implements IAdminRepository {
  async findUsers(
    search?: string,
    page: number = 1,
    limit: number = 6,
  ): Promise<{ users: IUser[]; total: number }> {
    const query: any = { role: { $ne: "admin" } };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);
    return { users, total };
  }
  async blockUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true, runValidators: true },
    );
  }
  async unblockUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true, runValidators: true },
    );
  }
  async updateUser(
    userId: string,
    data: Partial<Pick<IUser, "username" | "email" | "role" | "isBlocked" | "gender" | "phone" | "city" | "pincode" | "profilePicture">>,
  ): Promise<IUser | null> {
    if (data.profilePicture) {
      const existingUser = await User.findById(userId);
      if (existingUser && existingUser.profilePicture && existingUser.profilePicture.includes("amazonaws.com")) {
        try {
          await storageProvider.deleteFile(existingUser.profilePicture);
        } catch (err: any) {
          // ignore or log
        }
      }
    }
    return await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true },
    ).select("-password");
  }
}
