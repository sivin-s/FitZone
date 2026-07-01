import { Router } from "express";

import { validate } from "../../../shared/middlewares/validate.middlewares.ts";
import { authenticate } from "../../../shared/middlewares/auth.middlewares.ts";

import { registerSchema } from "../schemas/register.schemas.ts";
import { loginSchema } from "../schemas/login.schemas.ts";
import { verifyOtpSchema } from "../schemas/verifyOtp.schemas.ts";
import { resendOtpSchema } from "../schemas/resendOtp.schemas.ts";
import { forgotPasswordSchema } from "../schemas/forgotPassword.schemas.ts";
import { resetPasswordSchema } from "../schemas/resetPassword.schemas.ts";

// injection
import { appContainer } from "../../../DiContainer.ts";
import {AUTH_TYPES} from "../../../DITypes/index.DITypes.ts"
import type { IAuthController } from "../interfaces/IAuthController.interfaces.ts"

const authController  = appContainer.get<IAuthController>(AUTH_TYPES.IAuthController)

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), authController.resendOtp);

router.post("/login", validate(loginSchema), authController.login);

router.get("/user-me", authController.userMe);    // checks userAccessToken only
router.get("/admin-me", authController.adminMe);  // checks adminAccessToken only

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
