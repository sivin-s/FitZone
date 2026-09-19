import { api } from '../lib/axios';
import type { ApiResponse, User, UserListParams, UsersResponse } from './types';
export const adminService = {
  getUsers: (params: UserListParams, signal?: AbortSignal) => api.get<ApiResponse<UsersResponse>>('/admin/users', { params, signal }),
  blockUser: (id: string) => api.patch<ApiResponse<{ isBlocked: boolean }>>(`/admin/users/${id}/block`),
  unblockUser: (id: string) => api.patch<ApiResponse<{ isBlocked: boolean }>>(`/admin/users/${id}/unblock`),
  updateUser: (id: string, data: FormData) => api.patch<ApiResponse<User>>(`/admin/users/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
