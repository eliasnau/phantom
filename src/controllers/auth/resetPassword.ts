import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";
import bcrypt from "bcryptjs";

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        code: "RESET_INVALID_INPUT",
        message: "Token and new password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        code: "RESET_WEAK_PASSWORD",
        message: "Password must be at least 8 characters long",
      });
    }

    const resetToken = await db.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
        usedAt: null,
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return res.status(400).json({
        code: "RESET_INVALID_TOKEN",
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: {
          password: hashedPassword,
        },
      }),
      db.passwordResetToken.update({
        where: { id: resetToken.id },
        data: {
          usedAt: new Date(),
        },
      }),
      db.session.updateMany({
        where: { userId: resetToken.userId },
        data: {
          isValid: false,
          revokedAt: new Date(),
          revokedReason: "Password reset",
        },
      }),
    ]);

    return res.json({
      code: "RESET_SUCCESS",
      message:
        "Password has been reset successfully. Please log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};
