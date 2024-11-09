import { Response } from "express";

export const authResponses = {
  invalidCredentials: (res: Response) =>
    res.status(401).json({ message: "Invalid credentials" }),

  accountLocked: (res: Response) =>
    res.status(403).json({
      message: "Account is temporarily locked. Please try again later",
    }),

  userBanned: (res: Response, reason?: string, expiresAt?: Date | null) =>
    res.status(403).json({
      code: "AUTH_USER_BANNED",
      message: "Account is banned",
      details: {
        reason,
        expiresAt,
      },
    }),

  emailNotVerified: (res: Response) =>
    res.status(403).json({
      code: "AUTH_EMAIL_NOT_VERIFIED",
      message: "Please verify your email address to continue",
    }),
};
