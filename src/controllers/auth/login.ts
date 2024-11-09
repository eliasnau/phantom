import { Request, Response } from "express";
import { authService } from "../../services/authService";
import { sessionService } from "../../services/sessionService";
import { generateTokens } from "../../utils/jwt";
import { setRefreshTokenCookie } from "../../utils/cookie";
import { authResponses } from "../../utils/responses";
import { db } from "../../lib/db";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return authResponses.invalidCredentials(res);
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return authResponses.accountLocked(res);
    }

    const isValid = await authService.validateCredentials(email, password);
    if (!isValid) {
      await authService.updateLoginAttempts(user.id, true);
      return authResponses.invalidCredentials(res);
    }

    const session = await sessionService.createSession({
      userId: user.id,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    const { accessToken, refreshToken } = await generateTokens({
      userId: user.id,
      sessionId: session.id,
      sessionToken: session.sessionToken,
    });

    await authService.updateLoginAttempts(user.id, false);
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImg: user.profileImg,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
