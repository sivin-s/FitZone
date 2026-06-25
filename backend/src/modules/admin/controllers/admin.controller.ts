import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../shared/handlers/asyncHandler.ts";
import { ApiResponse } from "../../../shared/responses/ApiResponse.ts";
import { AdminService } from "../services/admin.service.ts";
import { AdminRepository } from "../repositories/admin.repository.ts";
import type { AuthRequest } from "../../../types/index.ts";
import { NotFoundError } from "../../../shared/errors/NotFoundError.ts";

import type { IAdminController } from "../interfaces/IAdminController.ts";
import type { IAdminService } from "../interfaces/IAdminService.ts";
import { UserMapper } from "../../users/mapper/user.mapper.ts";
import { storageProvider } from "../../../shared/services/s3Storage.provider.ts";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  getUsers = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { search, page = 1, limit = 20 } = req.query;
      const result = await this._adminService.getUsers(
        search as string | undefined,
        Number(page),
        Number(limit),
      );

      const usersList = UserMapper.toDtoList(result.users);
      const usersWithUrls = await Promise.all(
        usersList.map(async (u) => {
          if (u.profilePicture) {
            u.profilePicture = await storageProvider.getPresignedUrl(u.profilePicture);
          }
          return u;
        })
      );

      res.status(200).json(
        new ApiResponse(200, "Users retrieved successfully", {
          users: usersWithUrls,
          total: result.total,
        }),
      );
    },
  );

  blockUser = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      _next: NextFunction,
    ): Promise<void> => {
      const { userId } = req.params;
      const adminId = req.user?.userId;
      const result = await this._adminService.blockUser(
        userId as string,
        adminId as string,
      );
      res.status(200).json(
        new ApiResponse(200, "User blocked successfully", {
          isBlocked: result.isBlocked,
        }),
      );
    },
  );

  unblockUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { userId } = req.params;
      const result = await this._adminService.unblockUser(userId as string);
      res.status(200).json(
        new ApiResponse(200, "User unblocked successfully", {
          isBlocked: result.isBlocked,
        }),
      );
    },
  );

  updateUser = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      _next: NextFunction,
    ): Promise<void> => {
      // admin
      const adminId = req.user?.userId;
      const { userId } = req.params;
      const { username, email, role, isBlocked, gender, phone, city, pincode } = req.body;

      const parsedIsBlocked = isBlocked === "true" ? true : isBlocked === "false" ? false : undefined;

      let profilePictureUrl = undefined;
      if (req.file) {
        profilePictureUrl = await storageProvider.uploadFile(req.file, "avatars");
      }

      const updateUser = await this._adminService.updateUser(
        userId as string,
        adminId as string,
        {
          username,
          email,
          role,
          isBlocked: parsedIsBlocked,
          gender,
          phone,
          city,
          pincode,
          ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        },
      );
      if (!updateUser) {
        throw new NotFoundError("User not found");
      }
      const userDto = UserMapper.toDto(updateUser);
      if (userDto.profilePicture) {
        userDto.profilePicture = await storageProvider.getPresignedUrl(
          userDto.profilePicture,
        );
      }
      res
        .status(200)
        .json(new ApiResponse(200, "User updated successfully", userDto));
    },
  );
}

// instance creating
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
export const adminController = new AdminController(adminService);
