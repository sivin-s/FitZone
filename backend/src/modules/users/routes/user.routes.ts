import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/auth.middlewares.ts";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // server memory for temporary - before uploading to provider.

// injection
// import { userContainer } from "../DI/container.ts";
import { appContainer } from "../../../DiContainer.ts";
import {TYPES} from "../../../DITypes/users.DITypes.ts"
import type { IUserController } from "../interfaces/IUserController.interfaces.ts";

// const userController = userContainer.get<IUserController>(TYPES.IUserController)

const userController = appContainer.get<IUserController>(TYPES.IUserController)

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.patch("/change-password", userController.changePassword);
router.patch("/avatar", upload.single("image"), userController.updateAvatar);

export default router;
