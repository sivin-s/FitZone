import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import { authorizeRoles } from "../../../middleware/role.middleware.ts";
import { adminController } from "../controllers/admin.controller.ts";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate, authorizeRoles("admin"));

router.get("/users", adminController.getUsers);
router.patch("/users/:userId/block", adminController.blockUser);
router.patch("/users/:userId/unblock", adminController.unblockUser);
router.patch("/users/:userId", upload.single("image"), adminController.updateUser);

export default router;
