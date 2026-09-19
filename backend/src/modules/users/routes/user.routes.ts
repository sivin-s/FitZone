import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/auth.middlewares.ts";
import { imageUpload } from "../../../shared/middlewares/imageUpload.middlewares.ts";
import { validate } from "../../../shared/middlewares/validate.middlewares.ts";
import {
  profileSchema,
  changePasswordSchema,
} from "../schemas/profile.schemas.ts";

const router = Router();

// injection
// import { userContainer } from "../DI/container.ts";
import { appContainer } from "../../../DiContainer.ts";
import { TYPES } from "../../../DITypes/users.DITypes.ts";
import type { IUserController } from "../interfaces/IUserController.interfaces.ts";

// const userController = userContainer.get<IUserController>(TYPES.IUserController)

const userController = appContainer.get<IUserController>(TYPES.IUserController);

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", validate(profileSchema), userController.updateProfile);
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  userController.changePassword,
);
router.patch(
  "/avatar",
  imageUpload.single("image"),
  userController.updateAvatar,
);

export default router;
