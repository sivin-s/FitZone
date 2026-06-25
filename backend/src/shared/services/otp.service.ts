import { redisClient } from "../../config/redis.ts";
import cryto from "crypto";
import type {IOtpService} from '../interfaces/IOtpService.ts'

class OtpService {
  private readonly _OTP_PREFIX = "otp:";
  private readonly _OTP_EXPIRY_SECONDS = 600; // 10 Minutes

  generateOtp(): string {
    return cryto.randomInt(100000, 999999).toString();
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    await redisClient.set(
      `${this._OTP_PREFIX}${email}`,
      otp,
      "EX", // expiry -> EX (TTL)
      this._OTP_EXPIRY_SECONDS,
    );
  }
  async getOtp(email: string): Promise<string | null> {
    return await redisClient.get(`${this._OTP_PREFIX}${email}`);
  }
  async deleteOtp(email: string): Promise<void> {
    await redisClient.del(`${this._OTP_PREFIX}${email}`);
  }
}

export const otpService = new OtpService();
