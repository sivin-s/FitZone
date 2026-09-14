import mongoose from "mongoose";
// env (zod)
import { env } from "./env.config.ts";
import { logger } from "./logger.config.ts";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI!);
    logger.info("✅ MongoDB connected");
  } catch (error: unknown) {
    logger.error({ error }, "MongoDB connection failed");
    process.exit(1);
  }
};
