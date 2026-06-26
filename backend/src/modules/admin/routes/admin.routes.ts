import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import { authorizeRoles } from "../../../middleware/role.middleware.ts";
import multer from "multer";

// injection
import { adminContainer } from "../DI/container.ts"
import { TYPES } from "../types/types.ts"
import type { IAdminController } from "../interfaces/IAdminController.ts";
import { validate } from "../../../middleware/validate.middleware.ts";
import { updateUserSchema } from "../schemas/updateUser.schema.ts";

const adminController = adminContainer.get<IAdminController>(TYPES.IAdminController)

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
