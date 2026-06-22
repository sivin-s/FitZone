import express, { type Application } from "express";
import cors from "cors";
import cookiesParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/routes/auth.routes.ts";
import adminRoutes from "./modules/admin/routes/admin.routes.ts";
import userRoutes from "./modules/users/routes/user.routes.ts";

// env (zod)
import { env } from "./config/env.ts";

// middleware
import { notFoundMiddleware } from "./middleware/not-found.middleware.ts";
import { errorMiddleware } from "./middleware/error.middleware.ts";

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15m
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many request from this IP, please try again after 15 minutes.",
  },
});
app.use("/api/v1/", apiLimiter); // rate-limit middleware

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);

app.use(notFoundMiddleware); // Not Found Handler
app.use(errorMiddleware); //  global Error Handler

export default app;
