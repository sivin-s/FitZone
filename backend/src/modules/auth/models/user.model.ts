import mongoose, { type Model, type Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: "user" | "trainer" | "admin";
  isBlocked: boolean;
  isVerified: boolean;
  profilePicture?: string;
  googleId?: string;
  gender?: "Male" | "Female" | "Other";
  phone?: string;
  city?: string;
  pincode?: string;
  otp?: string;
  otpExpiry?: Date;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: [3, "Username must be at least 3 characters long"],
      maxLength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      minLength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "trainer", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: undefined,
    },
    googleId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: undefined,
    },
    city: {
      type: String,
      default: undefined,
    },
    pincode: {
      type: String,
      default: undefined,
    },
    phone: {
      type: String,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre<IUser>("save", async function (this: IUser) {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
