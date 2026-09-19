import { api } from '../lib/axios';
import type { ApiResponse, User } from './types';
export const userService = {
  getProfile: () => api.get<ApiResponse<User>>('/user/profile'),
  updateProfile: (data: { username: string; phone?: string | null; gender?: string | null; city?: string | null; pincode?: string | null }) => api.put<ApiResponse<User>>('/user/profile', data),
  changePassword: (data: { oldPassword: string; newPassword: string }) => api.patch<ApiResponse>('/user/change-password', data),
  uploadAvatar: (data: FormData) => api.patch<ApiResponse<{ profilePicture: string }>>('/user/avatar', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
