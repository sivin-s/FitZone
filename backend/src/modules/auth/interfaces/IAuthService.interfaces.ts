export interface IAuthService {
  googleAuth(idToken: string): Promise<{
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  }>;

  register(
    username: string,
    email: string,
    password: string,
  ): Promise<{
    message: string;
    userId: string;
    expiresInSeconds: number;
  }>;

  verifyOtp(
    email: string,
    otp: string,
  ): Promise<{
    message: string;
  }>;

  resendOtp(email: string): Promise<{
    message: string;
    expiresInSeconds: number;
  }>;

  login(
    email: string,
    password: string,
  ): Promise<{
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      isVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
  }>;

  forgotPassword(email: string): Promise<{
    message: string;
    expiresInSeconds: number;
  }>;

  resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<{
    message: string;
  }>;
}
