import { Redis } from "ioredis";
import { env } from "./env.config.ts";
import { logger } from "./logger.config.ts";

export const redisClient = new Redis(env.REDIS_URI, {
  retryStrategy(times) {
    if (times > 3) {
      logger.error("❌ Redis connection failed after 3 retries. Giving up.");
      return null; // stop retrying to prevent infinite loops.
    }
    return Math.min(times * 200, 1000);
  },
});

redisClient.on("connect", () => {
  logger.info("✅ Redis connected successfully");
});

redisClient.on("error", (error) => {
  logger.error({ error }, "Redis connection error");
});
