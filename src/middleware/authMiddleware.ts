import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { sessionService } from "../services/sessionService";
import { verifyAccessToken } from "../utils/jwt";
import { authResponses } from "../utils/responses";
import { JsonWebTokenError } from "jsonwebtoken";
import logger from "../utils/logger";

const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        code: "AUTH_NO_TOKEN",
        message: "No authentication token provided",
      });
    }

    const accessToken = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(accessToken);

    const [session, user] = await Promise.all([
      sessionService.validateSession(decoded.sessionId, decoded.tokenVersion),
      authService.getUserAuth(decoded.userId),
    ]);

    if (!session) {
      return res.status(401).json({
        code: "AUTH_INVALID_SESSION",
        message: "Invalid or expired session",
      });
    }

    if (!user) {
      return res.status(401).json({
        code: "AUTH_USER_NOT_FOUND",
        message: "User not found",
      });
    }

    if (user.banHistory?.[0]) {
      const ban = user.banHistory[0];
      return authResponses.userBanned(res, ban.reason, ban.expiresAt);
    }

    if (!user.emailVerified) {
      return authResponses.emailNotVerified(res);
    }

    sessionService
      .updateSessionActivity(session.id)
      .catch((err) => logger.error("Failed to update session activity:", err));

    (req as any).user = user;
    (req as any).sessionId = session.id;
    (req as any).session = session;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        code: "AUTH_INVALID_TOKEN",
        message: "Invalid authentication token",
      });
    }
    logger.error("Authentication middleware error:", error);
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  }
};

export default authenticationMiddleware;
