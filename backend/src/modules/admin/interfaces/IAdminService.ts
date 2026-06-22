import type { IUser } from "../../auth/models/user.model.ts";

export interface IAdminService {
  getUsers(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{
    users: IUser[];
    total: number;
  }>;

  blockUser(userId: string, adminId: string): Promise<IUser>;

  unblockUser(userId: string): Promise<IUser>;

  updateUser(
    userId: string,
    adminId: string,
    data: Partial<Pick<IUser, "username" | "email" | "role" | "isBlocked" | "gender" | "phone" | "city" | "pincode" | "profilePicture">>,
  ): Promise<IUser | null>;
}
