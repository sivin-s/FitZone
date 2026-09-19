import type { UserListOptions } from "../schemas/listUsers.schemas.ts";
import type { IUser } from "../../auth/models/user.models.ts";

export interface IAdminRepository {
  findUsers(
    search?: string,
    page?: number,
    limit?: number,
    options?: UserListOptions,
  ): Promise<{
    users: IUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>; // paginated user list
  blockUser(userId: string): Promise<IUser | null>;
  unblockUser(userId: string): Promise<IUser | null>;
  updateUser(
    userId: string,
    data: Partial<
      Pick<
        IUser,
        | "username"
        | "email"
        | "role"
        | "isBlocked"
        | "gender"
        | "phone"
        | "city"
        | "pincode"
        | "profilePicture"
      >
    >,
  ): Promise<IUser | null>;
}
