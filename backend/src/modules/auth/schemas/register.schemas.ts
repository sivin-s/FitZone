import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .trim(),
    email: z.email("Invalid email format").toLowerCase().trim(),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s])\S{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),
  }),
});
