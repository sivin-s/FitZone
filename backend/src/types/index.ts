import type { Request } from "express";

// data contains in the request(jwt)
export interface AuthPayload {
  userId: string;
  role: "user" | "trainer" | "admin";
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
