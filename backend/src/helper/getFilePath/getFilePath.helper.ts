import path from 'path';
import { fileURLToPath } from 'url';

const  filename = fileURLToPath(import.meta.url);

/**
 * 
 * @param fileUrl eg: import.env.url
 * @returns  eg: /box/index.js - current  file  path
 */
export const __filename = (fileUrl:string)=> fileURLToPath(fileUrl)


