import {
  listUsersSchema,
  type UserListOptions,
} from "../schemas/listUsers.schemas.ts";
import type { IAdminRepository } from "../interfaces/IAdminRepository.interfaces.ts";
import type { IAdminService } from "../interfaces/IAdminService.interfaces.ts";
import { NotFoundError } from "../../../shared/errors/NotFoundError.errors.ts";
import { BadRequestError } from "../../../shared/errors/BadRequestError.errors.ts";
import type { IUser } from "../../auth/models/user.models.ts";

// injection
import { injectable, inject } from "inversify";
import { TYPES } from "../../../DITypes/admin.DITypes.ts";

@injectable()
export class AdminService implements IAdminService {
  // constructor(private _adminRepository: IAdminRepository) {}
  constructor(
    @inject(TYPES.IAdminRepository) private _adminRepository: IAdminRepository,
  ) {}

  async getUsers(
    search?: string,
    page: number = 1,
    limit: number = 20,
    options?: UserListOptions,
  ) {
    if (
      (search !== undefined && typeof search !== "string") ||
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 1000
    ) {
      throw new BadRequestError("Invalid search or pagination parameters.");
    }
    const parsed = listUsersSchema.parse({ search, page, limit, ...options });
    return await this._adminRepository.findUsers(
      parsed.search,
      parsed.page,
      parsed.limit,
      parsed,
    );
  }
  async blockUser(userId: string, adminId: string) {
    if (userId === adminId) {
      throw new BadRequestError("You cannot block your own account");
    }
    const user = await this._adminRepository.blockUser(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
  async unblockUser(userId: string) {
    const user = await this._adminRepository.unblockUser(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
  async updateUser(
    userId: string,
    adminId: string,
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
  ) {
    if (userId === adminId && data.role && data.role !== "admin") {
      throw new BadRequestError("Admins cannot change their own role.");
    }
    if (userId === adminId && data.isBlocked) {
      throw new BadRequestError("You cannot block your own account");
    }
    return await this._adminRepository.updateUser(userId, data);
  }
}
