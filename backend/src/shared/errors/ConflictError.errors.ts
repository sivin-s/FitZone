import { HttpStatus } from "../enums/httpStatus.enums.ts";
import { AppError } from "./AppError.errors.ts";

export class ConflictError extends AppError {
  constructor(
    message = "Resource already exists or conflicts with current state",
  ) {
    super(message, HttpStatus.CONFLICT);
  }
}
