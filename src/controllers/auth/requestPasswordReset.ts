import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";
import crypto from "crypto";
//import { sendPasswordResetEmail } from "../../lib/email";

export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        code: "RESET_NO_EMAIL",
        message: "Email is required",
      });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    //* Don't reveal if user exists, idk if want to keep
    if (!user) {
      return res.json({
        code: "RESET_EMAIL_SENT",
        message:
          "If an account exists, you will receive a password reset email",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await db.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    //await sendPasswordResetEmail(user.email, token);

    return res.json({
      code: "RESET_EMAIL_SENT",
      message: "If an account exists, you will receive a password reset email",
    });
  } catch (error) {
    next(error);
  }
};
