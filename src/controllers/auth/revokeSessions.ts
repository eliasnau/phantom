import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";
import logger from "../../utils/logger";

export const revokeSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.params;
    const userId = (req as any).user.id;

    const session = await db.session.findFirst({
      where: {
        id: sessionId,
        userId,
        isValid: true,
      },
    });

    if (!session) {
      return res.status(404).json({
        code: "SESSION_NOT_FOUND",
        message: "Session not found or already revoked",
      });
    }

    if (session.id === (req as any).sessionId) {
      return res.status(400).json({
        code: "SESSION_REVOKE_CURRENT",
        message: "Cannot revoke current session. Use logout instead.",
      });
    }

    await db.session.update({
      where: { id: sessionId },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: "User revoked",
      },
    });

    return res.json({
      code: "SESSION_REVOKED",
      message: "Session revoked successfully",
    });
  } catch (error) {
    logger.error("Error revoking session:", error);
    return res.status(500).json({
      code: "AUTH_ERROR",
      message: "Internal server error",
    });
  }
};

export const revokeAllSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const currentSessionId = (req as any).sessionId;

    const result = await db.session.updateMany({
      where: {
        userId,
        isValid: true,
      },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: "User revoked all sessions",
      },
    });

    return res.json({
      code: "SESSIONS_REVOKED",
      message: "All other sessions revoked successfully",
      count: result.count,
    });
  } catch (error) {
    logger.error("Error revoking all sessions:", error);
    return res.status(500).json({
      code: "AUTH_ERROR",
      message: "Internal server error",
    });
  }
};
