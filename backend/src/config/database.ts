import mongoose from "mongoose";
// env (zod)
import { env } from "./env.ts";
import { logger } from "./logger.ts";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI!);
    logger.info("✅ MongoDB connected");
  } catch (err: any) {
    logger.error("❌ MongoDB connection failed", err.message);
    process.exit(1);
  }
};
