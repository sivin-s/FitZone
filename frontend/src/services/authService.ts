import { api } from '../lib/axios';
import type { ApiResponse, LoginUser, Session } from './types';

export const authService = {
  login: (data: { email: string; password: string }) => api.post<ApiResponse<{ user: LoginUser }>>('/auth/login', data),
  google: (data: { idToken: string }) => api.post<ApiResponse<{ user: LoginUser }>>('/auth/google', data),
  register: (data: { username: string; email: string; password: string }) => api.post<ApiResponse<{ userId: string; expiresInSeconds: number }>>('/auth/register', data),
  verifyOtp: (data: { email: string; otp: string }) => api.post<ApiResponse>('/auth/verify-otp', data),
  resendOtp: (data: { email: string }) => api.post<ApiResponse<{ expiresInSeconds: number }>>('/auth/resend-otp', data),
  forgotPassword: (data: { email: string }) => api.post<ApiResponse<{ expiresInSeconds: number }>>('/auth/forgot-password', data),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => api.post<ApiResponse>('/auth/reset-password', data),
  logout: () => api.post<ApiResponse>('/auth/logout'),
  userMe: () => api.get<ApiResponse<Session>>('/auth/user-me'),
  adminMe: () => api.get<ApiResponse<Session>>('/auth/admin-me'),
};
