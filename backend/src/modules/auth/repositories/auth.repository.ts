import User, { type IUser } from "../models/user.model.ts";
import type { IAuthRepository } from "../interfaces/IAuthRepository.ts";

// injection
import {injectable} from "inversify";
import { AdminRepository } from '../../admin/repositories/admin.repository';
import { BaseRepository } from "../../../common/repositories/BaseRepository.ts";

// @injectable()
export class AuthRepository extends BaseRepository<IUser>  implements IAuthRepository {

  constructor(){
    super(User) // pass modal
  }


  async findByEmail(email: string): Promise<IUser | null> {
    return super.findOne({email},"+password"); // override the parent method behavior.
  }

  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return this.findOne({ _id: id },"+password");
  }
 
  async updateVerificationStatus(
    userId: string,
    isVerified: boolean,
  ): Promise<IUser | null> {
    return this.update(
       userId,
      { isVerified }, // updating data
    );
  }
  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<IUser | null> {
    const user = await this.findByIdWithPassword(userId);
    if (!user) return null;
    user.password = newPassword;
    await user.save();
    return user;
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return this.findOne({ googleId });
  }
  async linkGoogleId(userId: string, googleId: string): Promise<IUser | null> {
    return this.update(
      userId,
      { googleId, isVerified: true }, // update
    );
  }

  async updateProfile(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    return this.update(userId, updateData);
  }

  async updateAvatar(
    userId: string,
    profilePicture: string,
  ): Promise<IUser | null> {
    return this.update(
      userId,
      { profilePicture }, // update data
    );
  }
}
