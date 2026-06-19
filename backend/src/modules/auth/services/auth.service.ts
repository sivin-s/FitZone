import { BadRequestError } from "../../../shared/errors/BadRequestError.ts";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.ts";
import { ConflictError } from "../../../shared/errors/ConflictError.ts";
import { otpService } from "../../../shared/services/otp.service.ts";
import { emailService } from "../../../shared/services/email.service.ts";
import { jwtService } from "../../../shared/services/jwt.service.ts";

import { OAuth2Client } from "google-auth-library";
import { env } from "../../../config/env.ts";

import type { IAuthRepository } from "../interfaces/IAuthRepository.ts";
import type { IAuthService } from "../interfaces/IAuthService.ts";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export class AuthService implements IAuthService {
  constructor(private authRepository: IAuthRepository) {}

  // google auth

  async googleAuth(idToken: string) {
    // verify google token
    let googleUser: { email: string; sub: string; name?: string } | undefined;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (payload) {
        googleUser = {
          email: payload.email ?? "",
          sub: payload.sub,
          name: payload.name,
        };
      }
    } catch (_error) {
      throw new UnauthorizedError("Invalid Google token");
    }

    if (!googleUser) {
      throw new UnauthorizedError("Invalid Google token payload");
    }

    const email = googleUser.email;
    const googleId = googleUser.sub; // claim - unique
    const username = googleUser.name || email.split("@")[0];

    // check if user exists by Google Id
    let user = await this.authRepository.findByGoogleId(googleId);

    if (user) {
      if (user.isBlocked)
        throw new UnauthorizedError("Your account has been blocked");
    } else {
      const existingEmailUser = await this.authRepository.findByEmail(email);
      if (existingEmailUser) {
        if (existingEmailUser.googleId) {
          throw new ConflictError(
            "This email is already linked to a different Google account",
          );
        }
        user = await this.authRepository.linkGoogleId(
          existingEmailUser._id.toString(),
          googleId,
        );
      } else {
        user = await this.authRepository.create({
          username,
          email,
          googleId,
          isVerified: true,
          role: "user",
        });
      }
    }

    if (!user) {
      throw new UnauthorizedError("Unable to authenticate with Google");
    }

    // generate tokens
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    return {
      message: "Google authentication successful",
      user: {
        id: user?._id.toString(),
        username: user?.username,
        email: user?.email,
        role: user?.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async register(username: string, email: string, password: string) {
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("This email is already registered");
    }
    const newUser = await this.authRepository.create({
      username,
      email,
      password,
      isVerified: false,
    });
    const otp = otpService.generateOtp();
    await otpService.storeOtp(email, otp); // store in redis
    await emailService.sendOtp(email, otp);
    return {
      message: "Registration successful. Please check your email for the OTP.",
      userId: newUser._id.toString(),
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new BadRequestError("User not found");
    if (user.isVerified) throw new BadRequestError("User is already verified");

    const storedOtp = await otpService.getOtp(email);
    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestError("Invalid or expired OTP");
    }

    await this.authRepository.updateVerificationStatus(
      user._id.toString(),
      true,
    );
    await otpService.deleteOtp(email);

    return { message: "Email verified successfully. You can now login" };
  }

  async resendOtp(email: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new BadRequestError("User not found");
    if (user.isVerified) throw new BadRequestError("User is already verified");

    const otp = otpService.generateOtp();
    await otpService.storeOtp(email, otp);
    await emailService.sendOtp(email, otp);

    return { message: "A new OTP has been sent to your email" };
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid email or password");
    if (user.isBlocked) {
      throw new UnauthorizedError("Your account has been blocked by the admin");
    }
    if (!user.isVerified) {
      throw new UnauthorizedError("Please verify your email before logging in");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    // token
    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    return {
      message: "Login successful",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      return {
        message: "If an account with this email exists, an OTP has been sent",
      };
    }
    const otp = otpService.generateOtp();
    await otpService.storeOtp(email, otp);
    await emailService.sendPasswordResetOtp(email, otp);
    return {
      message: "If an account with this email exists, and OTP has been sent.",
    };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new BadRequestError("Invalid request");

    const storedOtp = await otpService.getOtp(email);
    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestError("Invalid or expired OTP.");
    }

    await this.authRepository.updatePassword(user._id.toString(), newPassword);
    await otpService.deleteOtp(email);

    return { message: "Password reset successfully" };
  }
}
