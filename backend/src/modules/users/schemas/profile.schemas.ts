import { z } from "zod";

export const profileSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(30).optional(),
    phone: z
      .string()
      .regex(/^(\d{10})?$/)
      .optional(),
    gender: z.enum(["Male", "Female", "Other", ""]).optional(),
    city: z.string().trim().max(100).optional(),
    pincode: z
      .string()
      .regex(/^(\d{6})?$/)
      .optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s])\S{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),
  }),
});
