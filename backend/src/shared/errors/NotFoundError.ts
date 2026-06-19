import { AppError } from "./AppError.ts";

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found") {
    super(message, 404);
  }
}
