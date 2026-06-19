import { z } from "zod";

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .email("Invalid email format")
      .toLowerCase() // convert input to lowercase.
      .trim(),
    otp: z
      .string("OTP is required")
      .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  }),
});
