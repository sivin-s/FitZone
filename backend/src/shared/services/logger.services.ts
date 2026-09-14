import { injectable } from "inversify";
import pino, { type Logger } from "pino";
import fs from "fs";
import { env } from "../../config/env.config.ts";
import type { ILogger } from "../interfaces/ILogger.interfaces.ts";
import path from "path";

import { __filename } from "../../helper/getFilePath/getFilePath.helper.ts";
import { fullDirPath } from "../../helper/getDirectoryPath/getDirectoryPath.helper.ts";

// file path
const pathOfFile = __filename(import.meta.url);
const dirOfFile = fullDirPath(pathOfFile, "../../logs");
@injectable() // decorator tells to compile  register the class
export class LoggerService implements ILogger {
  private adminLogger: Logger;
  private userLogger: Logger;

  constructor() {
    const logDir = dirOfFile;
    if (!logDir) {
      throw new Error("Logs directory is not defined.");
    }
    // create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const adminLogPath = path.join(logDir, "admin.log");
    const userLogPath = path.join(logDir, "user.log");

    if (env.NODE_ENV === "production") {
      // admin logger
      this.adminLogger = pino(
        {
          level: "info",
          timestamp: pino.stdTimeFunctions.isoTime,
          redact: ["password", "token"],
        },
        pino.destination(adminLogPath),
      );

      // user logger (Trainer + Trainee)
      this.userLogger = pino(
        {
          level: "info",
          timestamp: pino.stdTimeFunctions.isoTime,
          redact: ["password", "token"],
          base: { pid: false },
        },
        pino.destination({
          dest: userLogPath,
          sync: false,
        }),
      );
    } else {
      // Development/testing mode - log to console AND write to files

      // Admin transport: console + admin.log
      const adminTransport = pino.transport({
        targets: [
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          },
          {
            target: "pino/file",
            options: {
              destination: adminLogPath,
              mkdir: true,
            },
          },
        ],
      });

      this.adminLogger = pino(
        {
          level: "debug",
          timestamp: pino.stdTimeFunctions.isoTime,
          redact: ["password", "token"],
        },
        adminTransport,
      );

      // User transport: console + user.log
      const userTransport = pino.transport({
        targets: [
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          },
          {
            target: "pino/file",
            options: {
              destination: userLogPath,
              mkdir: true,
            },
          },
        ],
      });

      this.userLogger = pino(
        {
          level: "debug",
          timestamp: pino.stdTimeFunctions.isoTime,
          redact: ["password", "token"],
          base: { pid: false },
        },
        userTransport,
      );
    }
  }

  // main methods
  info(message: unknown, isAdmin?: boolean): void {
    if (isAdmin) {
      this.adminLogger.info(message);
    } else {
      this.userLogger.info(message);
    }
  }

  error(message: unknown, isAdmin?: boolean): void {
    if (isAdmin) {
      this.adminLogger.error(message);
    } else {
      this.userLogger.error(message);
    }
  }

  warn(message: unknown, isAdmin?: boolean): void {
    if (isAdmin) {
      this.adminLogger.warn(message);
    } else {
      this.userLogger.warn(message);
    }
  }

  debug(message: unknown, isAdmin?: boolean): void {
    if (isAdmin) {
      this.adminLogger.debug(message);
    } else {
      this.userLogger.debug(message);
    }
  }
}
