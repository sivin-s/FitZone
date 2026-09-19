export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
}
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'trainer' | 'admin';
  isBlocked: boolean;
  isVerified: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
  phone?: string;
  gender?: string;
  city?: string;
  pincode?: string;
}
export interface Session { userId: string; role: User['role']; }
export interface LoginUser { id: string; username: string; email: string; role: User['role']; }
export interface UsersResponse { users: User[]; total: number; page: number; limit: number; totalPages: number; }
export interface UserListParams {
  search?: string;
  page?: number;
  limit?: number;
  membership?: 'all' | 'premium' | 'trainers' | 'basic';
  status?: 'all' | 'active' | 'blocked';
  sortBy?: 'createdAt' | 'username' | 'email';
  sortOrder?: 'asc' | 'desc';
}
