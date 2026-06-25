import type { Response, NextFunction } from "express";
import { asyncHandler } from "../../../shared/handlers/asyncHandler.ts";
import { ApiResponse } from "../../../shared/responses/ApiResponse.ts";
import { UserService } from "../services/user.service.ts";
import { AuthRepository } from "../../auth/repositories/auth.repository.ts";
import type { AuthRequest } from "../../../types/index.ts";
import { BadRequestError } from "../../../shared/errors/BadRequestError.ts";
import { NotFoundError } from "../../../shared/errors/NotFoundError.ts";
import { storageProvider } from "../../../shared/services/s3Storage.provider.ts";

import type { IUserService } from "../interfaces/IUserService.ts";
import type { IUserController } from "../interfaces/IUserController.ts";

// mapper
import { UserMapper } from "../mapper/user.mapper.ts";

// injection
import {injectable, inject} from "inversify";
import {TYPES} from "../types/types.ts"

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.IUserService) private _userService: IUserService
  ) {}

  getProfile = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      const user = await this._userService.getProfile(
        req.user?.userId as string,
      );
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const userDto = UserMapper.toDto(user);
      if (userDto.profilePicture) {
        // return presigned URI - temporary
        userDto.profilePicture = await storageProvider.getPresignedUrl(
          userDto.profilePicture,
        );
      }

      res
        .status(200)
        .json(new ApiResponse(200, "Profile retrieved successfully", userDto));
    },
  );

  updateProfile = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      const result = await this._userService.updateProfile(
        req.user?.userId as string,
        req.body,
      );

      const resultObj = result ? result.toObject() : result;
      if (resultObj && resultObj.profilePicture) {
        resultObj.profilePicture = await storageProvider.getPresignedUrl(
          resultObj.profilePicture,
        );
      }

      res
        .status(200)
        .json(new ApiResponse(200, "Profile updated successfully", resultObj));
    },
  );

  changePassword = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      const { oldPassword, newPassword } = req.body;
      const result = await this._userService.changePassword(
        req.user?.userId as string,
        oldPassword,
        newPassword,
      );
      res.status(200).json(new ApiResponse(200, result.message));
    },
  );

  updateAvatar = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.file)
        throw new BadRequestError("No file uploaded. Please provide an image");

      const result = await this._userService.updateAvatar(
        req.user?.userId as string,
        req.file,
      );

      const signedUrl = await storageProvider.getPresignedUrl(
        result.profilePicture,
      );

      res.status(200).json(
        new ApiResponse(200, "Avatar updated successfully", {
          profilePicture: signedUrl,
        }),
      );
    },
  );
}

// instance DI
// const authRepository = new AuthRepository();
// const userService = new UserService(authRepository);
// export const userController = new UserController(userService);
