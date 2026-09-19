export enum ErrorName {
  // Mongoose Errors
  VALIDATION_ERROR = "ValidationError",
  CAST_ERROR = "CastError",

  // JWT Errors
  JSON_WEB_TOKEN_ERROR = "JsonWebTokenError",
  TOKEN_EXPIRED_ERROR = "TokenExpiredError",
  NOT_BEFORE_ERROR = "NotBeforeError",
}

export { HttpStatus } from "./httpStatus.enums.ts";
