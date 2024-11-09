import { Request, Response } from "express";
import { db } from "../../lib/db";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImg: true,
        emailVerified: true,
        twoFactorEnabled: true,
        riskLevel: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "An error occurred while fetching user data",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        profileImg: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "An error occurred while fetching user data",
    });
  }
};
