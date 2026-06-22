import type { IAdminRepository } from "../interfaces/IAdminRepository.ts";
import type { IAdminService } from "../interfaces/IAdminService.ts";
import { NotFoundError } from "../../../shared/errors/NotFoundError.ts";
import { BadRequestError } from "../../../shared/errors/BadRequestError.ts";
import type { IUser } from "../../auth/models/user.model.ts";
export class AdminService implements IAdminService {
  constructor(private adminRepository: IAdminRepository) {}

  async getUsers(search?: string, page: number = 1, limit: number = 20) {
    return await this.adminRepository.findUsers(search, page, limit);
  }
  async blockUser(userId: string, adminId: string) {
    if (userId === adminId) {
      throw new BadRequestError("You cannot block your own account");
    }
    const user = await this.adminRepository.blockUser(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
  async unblockUser(userId: string) {
    const user = await this.adminRepository.unblockUser(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
  async updateUser(
    userId: string,
    adminId: string,
    data: Partial<Pick<IUser, "username" | "email" | "role" | "isBlocked" | "gender" | "phone" | "city" | "pincode" | "profilePicture">>,
  ) {
    if (userId === adminId && data.role && data.role !== "admin") {
      throw new BadRequestError("Admins cannot change their own role.");
    }
    return await this.adminRepository.updateUser(userId, data);
  }
}
