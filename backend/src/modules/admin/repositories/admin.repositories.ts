import { BaseRepository } from "../../../common/repositories/Base.repositories.ts";
import type { UserListOptions } from "../schemas/listUsers.schemas.ts";
import type { QueryFilter } from "mongoose";
import User, { type IUser } from "../../auth/models/user.models.ts";
import type { IAdminRepository } from "../interfaces/IAdminRepository.interfaces.ts";
import { storageProvider } from "../../../shared/services/s3Storage.provider.services.ts";

// inject
import { injectable } from "inversify";

/*
   it will tell compiler generate the necessary metadata-
   to create the class's dependencies when th class is injected.
*/
@injectable()
export class AdminRepository
  extends BaseRepository<IUser>
  implements IAdminRepository
{
  constructor() {
    super(User);
  }

  async findUsers(
    search = "",
    page = 1,
    limit = 20,
    options?: UserListOptions,
  ) {
    const query: QueryFilter<IUser> = { role: { $ne: "admin" } };
    if (search) {
      const literal = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { username: { $regex: literal, $options: "i" } },
        { email: { $regex: literal, $options: "i" } },
      ];
    }
    if (options?.membership === "premium") query.isPremium = true;
    if (options?.membership === "trainers") query.role = "trainer";
    if (options?.membership === "basic") {
      query.role = "user";
      query.isPremium = { $ne: true };
    }
    if (options?.status === "active") query.isBlocked = false;
    if (options?.status === "blocked") query.isBlocked = true;
    const direction = options?.sortOrder === "asc" ? 1 : -1;
    const { items: users, ...pagination } = await this.findPaginated(
      query,
      page,
      limit,
      "-password",
      {
        sort: { [options?.sortBy ?? "createdAt"]: direction, _id: direction },
        collation: { locale: "en", strength: 2 },
      },
    );
    return { users, ...pagination };
  }
  async blockUser(userId: string): Promise<IUser | null> {
    return this.update(userId, { isBlocked: true });
  }
  async unblockUser(userId: string): Promise<IUser | null> {
    return this.update(userId, { isBlocked: false });
  }
  async updateUser(
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
  ): Promise<IUser | null> {
    if (data.profilePicture) {
      const existingUser = await this.findById(userId);
      if (
        existingUser &&
        existingUser.profilePicture &&
        existingUser.profilePicture.includes("amazonaws.com")
      ) {
        try {
          await storageProvider.deleteFile(existingUser.profilePicture);
        } catch {
          // ignore or log
        }
      }
    }
    return this.update(userId, { $set: data });
  }
}
