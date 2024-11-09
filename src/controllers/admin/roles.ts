import { Request, Response } from "express";
import { db } from "../../lib/db";
import { Permission } from "../../types/permission";
import logger from "../../utils/logger";

export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = await db.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: { users: true },
        },
      },
    });

    return res.json({ roles });
  } catch (error) {
    logger.error("List roles error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissions } = req.body;

    const role = await db.role.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissions.map((p: string) => ({ name: p })),
        },
      },
      include: {
        permissions: true,
      },
    });

    return res.json({ role });
  } catch (error) {
    logger.error("Create role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const assignRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { roleId, expiresAt } = req.body;

    const userRole = await db.userRole.create({
      data: {
        userId,
        roleId,
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return res.json({ userRole });
  } catch (error) {
    logger.error("Assign role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;
    const { name, description, permissions } = req.body;

    const role = await db.role.update({
      where: { id: roleId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(permissions && {
          permissions: {
            set: [], // Remove existing permissions
            connect: permissions.map((p: string) => ({ name: p })),
          },
        }),
      },
      include: {
        permissions: true,
        _count: {
          select: { users: true },
        },
      },
    });

    return res.json({ role });
  } catch (error) {
    logger.error("Update role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    // First delete all UserRole associations
    await db.userRole.deleteMany({
      where: { roleId },
    });

    // Then delete the role
    await db.role.delete({
      where: { id: roleId },
    });

    return res.json({ message: "Role deleted successfully" });
  } catch (error) {
    logger.error("Delete role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeRole = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = req.params;

    await db.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    return res.json({ message: "Role removed from user successfully" });
  } catch (error) {
    logger.error("Remove role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
