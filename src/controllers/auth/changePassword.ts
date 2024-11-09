import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";
import bcrypt from "bcryptjs";

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        code: "CHANGE_PASSWORD_INVALID_INPUT",
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        code: "CHANGE_PASSWORD_WEAK",
        message: "New password must be at least 8 characters long",
      });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        code: "CHANGE_PASSWORD_UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        code: "CHANGE_PASSWORD_INVALID_CURRENT",
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      }),
      db.session.updateMany({
        where: {
          userId,
          id: { not: (req as any).sessionId }, //! Keep current session, idk if smart to keep
        },
        data: {
          isValid: false,
          revokedAt: new Date(),
          revokedReason: "Password changed",
        },
      }),
    ]);

    return res.json({
      code: "CHANGE_PASSWORD_SUCCESS",
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
