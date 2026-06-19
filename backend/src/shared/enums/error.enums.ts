export enum ErrorName {
  // Mongoose Errors
  VALIDATION_ERROR = "ValidationError",
  CAST_ERROR = "CastError",

  // JWT Errors
  JSON_WEB_TOKEN_ERROR = "JsonWebTokenError",
  TOKEN_EXPIRED_ERROR = "TokenExpiredError",
  NOT_BEFORE_ERROR = "NotBeforeError",
}

export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}
