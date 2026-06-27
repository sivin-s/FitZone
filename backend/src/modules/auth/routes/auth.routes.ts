import { Router } from "express";

import { validate } from "../../../shared/middleware/validate.middleware.ts";
import { authenticate } from "../../../shared/middleware/auth.middleware.ts";

import { registerSchema } from "../schemas/register.schema.ts";
import { loginSchema } from "../schemas/login.schema.ts";
import { verifyOtpSchema } from "../schemas/verifyOtp.schema.ts";
import { resendOtpSchema } from "../schemas/resendOtp.schema.ts";
import { forgotPasswordSchema } from "../schemas/forgotPassword.schema.ts";
import { resetPasswordSchema } from "../schemas/resetPassword.schema.ts";

// injection
import { appContainer } from "../../../DiContainer.ts";
import {AUTH_TYPES} from "../../../DITypes/index.ts"
import type { IAuthController } from "../interfaces/IAuthController.ts"

const authController  = appContainer.get<IAuthController>(AUTH_TYPES.IAuthController)

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), authController.resendOtp);

router.post("/login", validate(loginSchema), authController.login);

router.post("/google", authController.googleAuth);

router.post("/refresh-token", authController.refreshToken); //call when - (retry)  after access token expired.

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

router.post("/logout", authenticate, authController.logout);

export default router;
