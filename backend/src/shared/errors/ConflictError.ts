import { AppError } from "./AppError.ts";

export class ConflictError extends AppError {
  constructor(
    message = "Resource already exists or conflicts with current state",
  ) {
    super(message, 409);
  }
}
