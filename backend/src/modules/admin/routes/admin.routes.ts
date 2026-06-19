import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import { authorizeRoles } from "../../../middleware/role.middleware.ts";
import { adminController } from "../controllers/admin.controller.ts";

const router = Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/users", adminController.getUsers);
router.patch("/users/:userId/block", adminController.blockUser);
router.patch("/users/:userId/unblock", adminController.unblockUser);
router.patch("/users/:userId", adminController.updateUser);

export default router;
