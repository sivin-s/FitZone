import { fileURLToPath } from "url";

/**
 *
 * @param fileUrl eg: import.env.url
 * @returns  eg: /box/index.js - current  file  path
 */
export const __filename = (fileUrl: string) => fileURLToPath(fileUrl);
