import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import { userController } from "../controllers/user.controller.ts";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // server memory for temporary - before uploading to provider.

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.patch("/change-password", userController.changePassword);
router.patch("/avatar", upload.single("image"), userController.updateAvatar);

export default router;
