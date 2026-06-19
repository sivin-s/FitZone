import type { IUser } from "../../auth/models/user.model.ts";

export interface IAdminRepository {
  findUsers(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{
    users: IUser[];
    total: number;
  }>; // paginated user list
  blockUser(userId: string): Promise<IUser | null>;
  unblockUser(userId: string): Promise<IUser | null>;
  updateUser(
    userId: string,
    data: Partial<Pick<IUser, "username" | "role" | "isBlocked">>,
  ): Promise<IUser | null>;
}
