import type { Express } from "express";

import type {} from "multer"; // this line to force TS to load @types/multer

export interface IStorageProvider {
  uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  getPresignedUrl(fileUrl: string): Promise<string>;
}
