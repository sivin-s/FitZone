import { HttpStatus } from "../enums/httpStatus.enums.ts";
import { AppError } from "./AppError.errors.ts";

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}
