import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { BadRequestError } from "../errors/BadRequestError";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        // validate body, queries & params using zod schema
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      // Zod v4 uses error.issues; Zod v3 used error.errors
      const issues = Array.isArray(error.issues)
        ? error.issues
        : Array.isArray(error.errors)
          ? error.errors
          : null;

      const formattedErrors = issues
        ? issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          }))
        : [{ field: "unknown", message: error.message ?? "Validation error" }];

      next(
        new BadRequestError(
          `Validation failed: ${JSON.stringify(formattedErrors)}`,
        ),
      );
    }
  };
};
