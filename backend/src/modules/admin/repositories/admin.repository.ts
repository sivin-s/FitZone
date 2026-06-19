import User, { type IUser } from "../../auth/models/user.model.ts";
import type { IAdminRepository } from "../interfaces/IAdminRepository.ts";

export class AdminRepository implements IAdminRepository {
  async findUsers(
    search?: string,
    page: number = 1,
    limit: number = 6,
  ): Promise<{ users: IUser[]; total: number }> {
    const query: any = { role: { $ne: "admin" } };

    if (search) {
      query.$or = [
        { username: { $regex: search, $option: "i" } },
        { email: { $regex: search, $option: "i" } },
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
    data: Partial<Pick<IUser, "username" | "role" | "isBlocked">>,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true },
    ).select("-password");
  }
}
