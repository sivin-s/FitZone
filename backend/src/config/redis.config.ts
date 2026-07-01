import { Redis } from "ioredis";
import { env } from "./env.config.ts";
import { logger } from "./logger.config.ts";

export const redisClient = new Redis(env.REDIS_URI, {
  retryStrategy(times) {
    if (times > 3) {
      logger.error("❌ Redis connection failed after 3 retries. Giving up.");
      return null; // stop retrying to prevent infinite loops.
    }
  },
});

redisClient.on("connect", () => {
  logger.info("✅ Redis connected successfully");
});

redisClient.on("error", (err: any) => {
  logger.error("❌ Redis connection error:", err.message);
});
