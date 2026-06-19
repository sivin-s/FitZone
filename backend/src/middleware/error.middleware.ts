import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../shared/errors/AppError.ts";
import { logger } from "../config/logger.ts";
import { env } from "../config/env.ts";
import { ErrorName, HttpStatus } from "../shared/enums/error.enums.ts";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const err = error as {
    statusCode?: number;
    message?: string;
    name?: string;
    stack?: string;
    code?: number;
    path?: string;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, { path: string; message: string }>;
    isOperational?: boolean;
  };
  let statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";
  let errors: { field: string; message: string }[] | Record<string, unknown> =
    [];

  if (error instanceof ZodError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = "Validation failed";
    errors = error.flatten().fieldErrors || {};
  }
  // 2. Custom AppErrors (BadRequestError, NotFoundError, etc.)
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (err.name === ErrorName.VALIDATION_ERROR) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = "Data Validation Failed";
    errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === ErrorName.CAST_ERROR) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = `Invalid data format for: ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = HttpStatus.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for '${field}'. Please use another value.`;
  } else if (err.name === ErrorName.JSON_WEB_TOKEN_ERROR) {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = "Invalid token. Please log in again.";
  } else if (err.name === ErrorName.TOKEN_EXPIRED_ERROR) {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = "Token has expired. Please log in again.";
  } else if (err.name === ErrorName.NOT_BEFORE_ERROR) {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = "Token is not yet active.";
  }

  const isOperational =
    error instanceof AppError ? error.isOperational : statusCode < 500;

  // Logging
  if (isOperational) {
    logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.ip}`);
  } else {
    logger.error(
      `500 - ${message} - ${req.originalUrl} - ${req.method} - ${error.stack}`,
    );
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(Array.isArray(errors) && errors.length > 0 && { errors }),
    ...(typeof errors === "object" &&
      !Array.isArray(errors) &&
      Object.keys(errors).length > 0 && { errors }),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
