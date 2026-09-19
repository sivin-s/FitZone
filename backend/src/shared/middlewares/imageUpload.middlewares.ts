import multer from "multer";
import { BadRequestError } from "../errors/BadRequestError.errors.ts";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new BadRequestError("Only image files are allowed."));
      return;
    }
    callback(null, true);
  },
});
