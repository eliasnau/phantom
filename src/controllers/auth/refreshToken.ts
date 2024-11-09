import { Request, Response } from "express";
import { authService } from "../../services/authService";
import { sessionService } from "../../services/sessionService";
import { verifyRefreshToken, generateTokens } from "../../utils/jwt";
import { setRefreshTokenCookie } from "../../utils/cookie";
import crypto from "crypto";
import { db } from "../../lib/db";
import { JsonWebTokenError } from "jsonwebtoken";
import logger from "../../utils/logger";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        code: "AUTH_NO_REFRESH_TOKEN",
        message: "No refresh token provided",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const session = await db.session.findFirst({
      where: {
        id: decoded.sessionId,
        userId: decoded.userId,
        sessionToken: decoded.sessionToken,
        isValid: true,
        expires: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            profileImg: true,
            banHistory: {
              where: {
                OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
                AND: { liftedAt: null },
              },
            },
          },
        },
      },
    });

    if (!session?.user) {
      return res.status(401).json({
        code: "AUTH_INVALID_SESSION",
        message: "Invalid or expired session",
      });
    }

    if (session.user.banHistory.length > 0) {
      await sessionService.revokeSession(session.id, "User banned");
      return res.status(403).json({
        code: "AUTH_USER_BANNED",
        message: "Account is banned",
      });
    }

    const newSessionToken = crypto.randomUUID();
    await db.session.update({
      where: { id: session.id },
      data: {
        lastActive: new Date(),
        sessionToken: newSessionToken,
      },
    });

    // Increment token version
    await sessionService.incrementTokenVersion(session.id);

    const tokens = await generateTokens({
      userId: session.user.id,
      sessionId: session.id,
      sessionToken: newSessionToken,
    });

    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.json({
      accessToken: tokens.accessToken,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        profileImg: session.user.profileImg,
      },
    });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        code: "AUTH_INVALID_REFRESH_TOKEN",
        message: "Invalid refresh token",
      });
    }
    logger.error("refreshToken error:", error);
    return res.status(500).json({
      code: "AUTH_ERROR",
      message: "Internal server error",
    });
  }
};
