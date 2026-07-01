import { z } from "zod";

import dotenv from "dotenv";

dotenv.config(); // eject env into memory first(runtime) then zod operation.

const envSchema = z.object({
  // schema like mongoose..
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string(),
  CLIENT_URL: z.string(),
  MONGO_URI: z.string(),
  REDIS_URI: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_URL: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  //  Mailtrap SMTP credentials
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number), // converting string to number
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM_EMAIL: z.email(),
  SMTP_FROM_NAME: z.string(),
  // storage
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET: z.string(),
  // redis otp 
  OTP_EXPIRY_SECONDS: z.string().transform(Number),
  OTP_PREFIX: z.string()
});

const parsedEnv = envSchema.safeParse(process.env); // .env

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid Environment Variables",
    parsedEnv.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsedEnv.data;
