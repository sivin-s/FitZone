import { env } from "../config/env.config.ts";

export const getAccessTokenOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 15 * 60 * 1000, //15m
  path: "/", // cookies send by the browser '/' means all routes eg: /profile, /dashboard, /admin.
});

export const getRefreshTokenOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d's
  path: "/", // cookies send by the browser '/' means all routes.
});
