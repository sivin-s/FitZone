import { HttpStatus } from "../enums/httpStatus.enums.ts";
import { AppError } from "./AppError.errors.ts";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized. Please login to continue") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
