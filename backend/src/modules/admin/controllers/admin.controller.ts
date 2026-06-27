import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../shared/handler/asyncHandler.ts";
import { ApiResponse } from "../../../shared/response/ApiResponse.ts";
import type { AuthRequest } from "../../../types/AuthRequest.types.ts";
import { NotFoundError } from "../../../shared/errors/NotFoundError.ts";

import type { IAdminController } from "../interfaces/IAdminController.ts";
import type { IAdminService } from "../interfaces/IAdminService.ts";
import { UserMapper } from "../../users/mapper/user.mapper.ts";
import { storageProvider } from "../../../shared/services/s3Storage.provider.ts";

// zod dto
import type { UpdateUserRequestDto } from "../schemas/updateUser.schema.ts"
import { injectable,inject } from "inversify";

import {TYPES} from '../../../DITypes/admin.types.ts'

@injectable()
export class AdminController implements IAdminController {
  constructor(
   @inject(TYPES.IAdminService) private _adminService: IAdminService
  ) {}

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
      // dto using zod
      const data = req.body as UpdateUserRequestDto;  // incoming dto

      const serviceData = {
        ...data,
        role: data.role as "admin" | "user" | "trainer" | undefined,
        gender: data.gender as "Male" | "Female" | "Other" | undefined,
        isBlocked: data.isBlocked !== undefined ? Boolean(data.isBlocked): undefined
      }

      // admin
      const adminId = req.user?.userId as string;
      const userId = req.params?.userId as string;
      // const { username, email, role, isBlocked, gender, phone, city, pincode } = data;

      // const parsedIsBlocked = isBlocked === "true" ? true : isBlocked === "false" ? false : undefined;

      // let profilePictureUrl = undefined;
      // if (req.file) {
      //   profilePictureUrl = await storageProvider.uploadFile(req.file, "avatars");
      // }

      const updateUser = await this._adminService.updateUser(
        userId,
        adminId,
        // {
        //   username,
        //   email,
        //   role,
        //   isBlocked: parsedIsBlocked,
        //   gender,
        //   phone,
        //   city,
        //   pincode,
        //   ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        // },
        serviceData
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
// const adminRepository = new AdminRepository();
// const adminService = new AdminService(adminRepository);
// export const adminController = new AdminController(adminService);
