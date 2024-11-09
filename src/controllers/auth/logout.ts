import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";
import jwt from "jsonwebtoken";
import { env } from "../../env";
import logger from "../../utils/logger";

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        code: "NO_REFRESH_TOKEN",
        message: "No refresh token provided",
      });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_TOKEN_SECRET
      ) as {
        sessionId: string;
      };

      await db.session.update({
        where: { id: decoded.sessionId },
        data: {
          isValid: false,
          revokedAt: new Date(),
          revokedReason: "User logout",
        },
      });
    } catch (error) {
      return res.status(401).json({
        code: "INVALID_REFRESH_TOKEN",
        message: "Invalid refresh token",
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({
      code: "LOGOUT_SUCCESS",
      message: "Successfully logged out",
    });
  } catch (error) {
    logger.error("Login error:", error);
    return res.status(500).json({
      code: "AUTH_ERROR",
      message: "Internal server error",
    });
  }
};
