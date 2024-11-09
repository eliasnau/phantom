import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        code: "VERIFICATION_NO_TOKEN",
        message: "Verification token is required",
      });
    }

    const user = await db.user.findFirst({
      where: {
        emailVerificationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        code: "VERIFICATION_INVALID_TOKEN",
        message: "Invalid verification token",
      });
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
      },
    });

    return res.json({
      code: "VERIFICATION_SUCCESS",
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        emailVerified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
