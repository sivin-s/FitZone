export interface UserDto {
  _id: string;
  username: string;
  email: string;
  role: "user" | "trainer" | "admin";
  isBlocked: boolean;
  isVerified: boolean;
  profilePicture?: string;
  gender?: string;
  phone?: string;
  city?: string;
  pincode?: string;
  createdAt: Date;
  updatedAt: Date;
}
