import { Request, Response } from "express";
import { db } from "../../lib/db";
import logger from "../../utils/logger";

export const createBan = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason, expiresAt, note } = req.body;
    const issuedBy = (req as any).user.id;

    const ban = await db.ban.create({
      data: {
        userId,
        reason,
        note,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        issuedBy,
        ipAddress: req.ip,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Revoke all user sessions
    await db.session.updateMany({
      where: { userId },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: "User banned",
      },
    });

    return res.json({ ban });
  } catch (error) {
    logger.error("Create ban error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeBan = async (req: Request, res: Response) => {
  try {
    const { banId } = req.params;
    const liftedBy = (req as any).user.id;
    const { liftReason } = req.body;

    const ban = await db.ban.update({
      where: { id: banId },
      data: {
        liftedAt: new Date(),
        liftedBy,
        liftReason,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return res.json({ ban });
  } catch (error) {
    logger.error("Remove ban error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const listBans = async (req: Request, res: Response) => {
  try {
    const bans = await db.ban.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        issuedByUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        liftedByUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ bans });
  } catch (error) {
    logger.error("List bans error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBan = async (req: Request, res: Response) => {
  try {
    const { banId } = req.params;
    const { reason, expiresAt, note } = req.body;

    const ban = await db.ban.update({
      where: { id: banId },
      data: {
        ...(reason && { reason }),
        ...(note && { note }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return res.json({ ban });
  } catch (error) {
    logger.error("Update ban error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
