import { HttpStatus } from "../enums/httpStatus.enums.ts";
import { AppError } from "./AppError.errors.ts";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
