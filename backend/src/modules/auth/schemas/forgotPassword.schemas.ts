import { z } from "zod";

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
  }),
});
