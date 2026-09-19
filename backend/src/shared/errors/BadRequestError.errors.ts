import { AppError } from "./AppError.errors.ts";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}
