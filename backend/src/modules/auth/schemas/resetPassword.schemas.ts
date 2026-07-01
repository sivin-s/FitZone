import { z } from "zod";

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
    otp: z
      .string("OTP is required")
      .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
    newPassword: z
      .string("New password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character",
      )
      .refine((val) => !/\s/.test(val), {
        message: "Password must not contain spaces",
      }),
  }),
});
