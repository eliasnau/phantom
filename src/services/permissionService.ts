import { db } from "../lib/db";
import { Permission } from "../types/permission";

export const permissionService = {
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!user) return [];

    const permissions = new Set<Permission>();
    user.roles.forEach((userRole) => {
      userRole.role.permissions.forEach((permission) => {
        permissions.add(permission.name as Permission);
      });
    });

    return Array.from(permissions);
  },

  async hasPermission(
    userId: string,
    requiredPermission: Permission
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(requiredPermission);
  },

  async hasAnyPermission(
    userId: string,
    requiredPermissions: Permission[]
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return requiredPermissions.some((p) => permissions.includes(p));
  },

  async hasAllPermissions(
    userId: string,
    requiredPermissions: Permission[]
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return requiredPermissions.every((p) => permissions.includes(p));
  },
};
