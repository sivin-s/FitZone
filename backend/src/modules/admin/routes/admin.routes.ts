import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/auth.middlewares.ts";
import { authorizeRoles } from "../../../shared/middlewares/role.middlewares.ts";
import multer from "multer";

// injection

import { appContainer } from "../../../DiContainer.ts";
import { TYPES } from "../../../DITypes/admin.DITypes.ts"
import type { IAdminController } from "../interfaces/IAdminController.interfaces.ts";
import { validate } from "../../../shared/middlewares/validate.middlewares.ts";
import { updateUserSchema } from "../schemas/updateUser.schemas.ts";

// const adminController = adminContainer.get<IAdminController>(TYPES.IAdminController)
const adminController = appContainer.get<IAdminController>(TYPES.IAdminController);

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate, authorizeRoles("admin")); // router level middleware - notice: each route have different router level middlewares.

router.get("/users", adminController.getUsers);
router.patch("/users/:userId/block", adminController.blockUser);
router.patch("/users/:userId/unblock", adminController.unblockUser);
router.patch(
  "/users/:userId",
  validate(updateUserSchema),
  upload.single("image"), adminController.updateUser);

export default router;
