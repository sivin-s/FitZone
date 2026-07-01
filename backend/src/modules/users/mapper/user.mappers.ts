import type { IUser } from "../../auth/models/user.models";
import type { UserDto } from "../dto/user.dto";

export class UserMapper {
  static toDto(user: IUser): UserDto {
    return {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      gender: user.gender,
      phone: user.phone,
      city: typeof user.city === "string" ? user.city : undefined,
      pincode: typeof user.pincode === "string" ? user.pincode : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDtoList(users: IUser[]): UserDto[] {
    return users.map((user) => this.toDto(user));
  }
}
