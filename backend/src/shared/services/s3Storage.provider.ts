import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { IStorageProvider } from "../interfaces/IStorageProvider.ts";
import { env } from "../../config/env.ts";
import { logger } from "../../config/logger.ts";

export class S3StorageProvider implements IStorageProvider {
  private s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const fileKey = `${folder}/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    try {
      await this.s3Client.send(command);
      return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } catch (error: any) {
      logger.warn(
        `S3 Upload with public-read ACL failed: ${error.message}. Retrying without ACL...`,
      );
      const retryCommand = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      try {
        await this.s3Client.send(retryCommand);
        return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;
      } catch (retryError: any) {
        logger.error(`S3 Upload failed: ${retryError.message}`);
        if (env.NODE_ENV !== "production") {
          logger.info("Falling back to Base64 Data URI for local development");
          const base64Data = file.buffer.toString("base64");
          return `data:${file.mimetype};base64,${base64Data}`;
        }
        throw new Error("Failed to upload file to S3");
      }
    }
  }
  async deleteFile(fileUrl: string): Promise<void> {
    const urlParts = fileUrl.split(".amazonaws.com/"); // extract file-key
    if (urlParts.length < 2) return;
    const fileKey = urlParts[1];

    const command = new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: fileKey,
    });
    try {
      await this.s3Client.send(command);
    } catch (error: any) {
      logger.error("S3 Delete Failed:", error.message);
    }
  }
  async getPresignedUrl(fileUrl: string): Promise<string> {
    if (!fileUrl) return fileUrl;
    if (!fileUrl.includes(".amazonaws.com/")) return fileUrl; // not an S3 URL (local dev or external)

    try {
      const urlParts = fileUrl.split(".amazonaws.com/");
      if (urlParts.length < 2) return fileUrl;
      const fileKey = urlParts[1];

      const command = new GetObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: fileKey,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error: any) {
      logger.error(`Failed to generate presigned URL: ${error.message}`);
      return fileUrl;
    }
  }
}

export const storageProvider: IStorageProvider = new S3StorageProvider();
