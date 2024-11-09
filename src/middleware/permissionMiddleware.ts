import { Request, Response, NextFunction } from "express";
import { Permission } from "../types/permission";
import { permissionService } from "../services/permissionService";
import logger from "../utils/logger";

export const requirePermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          code: "AUTH_UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      const hasPermission = await permissionService.hasPermission(
        userId,
        permission
      );
      if (!hasPermission) {
        return res.status(403).json({
          code: "AUTH_FORBIDDEN",
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      logger.error("Permission check error:", error);
      return res.status(500).json({
        code: "SERVER_ERROR",
        message: "Internal server error",
      });
    }
  };
};

export const requireAnyPermission = (permissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          code: "AUTH_UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      const hasPermission = await permissionService.hasAnyPermission(
        userId,
        permissions
      );
      if (!hasPermission) {
        return res.status(403).json({
          code: "AUTH_FORBIDDEN",
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      logger.error("Permission check error:", error);
      return res.status(500).json({
        code: "SERVER_ERROR",
        message: "Internal server error",
      });
    }
  };
};
