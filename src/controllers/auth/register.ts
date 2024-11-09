import { NextFunction, Request, Response } from "express";
import { authService } from "../../services/authService";
import { sessionService } from "../../services/sessionService";
import { generateTokens } from "../../utils/jwt";
import { setRefreshTokenCookie } from "../../utils/cookie";
import { sendVerificationEmail } from "../../lib/nodemailer";
import { db } from "../../lib/db";
import logger from "../../utils/logger";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || password.length < 8) {
      return res.status(400).json({
        message: "Invalid email format or password too short",
      });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const user = await authService.createUser({ email, password, name });

    try {
      await sendVerificationEmail(user.email, user.emailVerificationToken!);
    } catch (emailError) {
      logger.error("Failed to send verification email:", emailError);
    }

    const session = await sessionService.createSession({
      userId: user.id,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      trustedDevice: true,
    });

    const { accessToken, refreshToken } = await generateTokens({
      userId: user.id,
      sessionId: session.id,
      sessionToken: session.sessionToken,
    });

    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: null,
      },
    });
  } catch (error) {
    next(error);
  }
};
