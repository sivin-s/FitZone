import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import { BadRequestError } from "../errors/BadRequestError.errors.ts";

export const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed: unknown = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed && typeof parsed === "object" && "body" in parsed) {
        req.body = parsed.body;
      }
      next();
    } catch (error: unknown) {
      if (!(error instanceof ZodError)) {
        next(error);
        return;
      }

      const formattedErrors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      next(new BadRequestError(JSON.stringify(formattedErrors)));
    }
  };
};
