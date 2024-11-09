import { Request, Response } from "express";
import { db } from "../../lib/db";
import logger from "../../utils/logger";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        profileImg: true,
        emailVerified: true,
        createdAt: true,
        riskLevel: true,
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.json({ users });
  } catch (error) {
    logger.error("List users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, riskLevel } = req.body;

    const user = await db.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(riskLevel && { riskLevel }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        riskLevel: true,
      },
    });

    return res.json({ user });
  } catch (error) {
    logger.error("Update user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await db.user.delete({
      where: { id: userId },
    });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
