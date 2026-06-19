import { AppError } from "./AppError.ts";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized. Please login to continue") {
    super(message, 401);
  }
}
