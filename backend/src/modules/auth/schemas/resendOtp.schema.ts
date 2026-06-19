import { z } from "zod";

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
  }),
});
