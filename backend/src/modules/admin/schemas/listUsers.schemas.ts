import { z } from "zod";

const positiveInteger = (maximum: number) =>
  z
    .union([
      z.number(),
      z.string().regex(/^[0-9]+$/, "Must be a positive integer"),
    ])
    .transform(Number)
    .pipe(z.number().int().min(1).max(maximum));

export const listUsersSchema = z.object({
  search: z.string().trim().max(100).default(""),
  page: positiveInteger(1000000).default(1),
  limit: positiveInteger(1000).default(20),
  membership: z.enum(["all", "premium", "trainers", "basic"]).default("all"),
  status: z.enum(["all", "active", "blocked"]).default("all"),
  sortBy: z.enum(["createdAt", "username", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type UserListOptions = Pick<
  z.infer<typeof listUsersSchema>,
  "membership" | "status" | "sortBy" | "sortOrder"
>;
