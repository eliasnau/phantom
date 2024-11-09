import { db } from "../lib/db";
import { Permission } from "../types/permission";

export const adminService = {
  async createDefaultRoles() {
    const roles = [
      {
        name: "SUPER_ADMIN",
        description: "Full system access",
        permissions: Object.values(Permission),
      },
      {
        name: "ADMIN",
        description: "System administration",
        permissions: [
          Permission.VIEW_USERS,
          Permission.MANAGE_USERS,
          Permission.VIEW_BANS,
          Permission.MANAGE_BANS,
          Permission.VIEW_ALL_SESSIONS,
        ],
      },
      {
        name: "MODERATOR",
        description: "Content moderation",
        permissions: [
          Permission.VIEW_USERS,
          Permission.VIEW_BANS,
          Permission.MANAGE_BANS,
        ],
      },
    ];

    for (const role of roles) {
      await db.role.upsert({
        where: { name: role.name },
        update: {},
        create: {
          name: role.name,
          description: role.description,
          permissions: {
            connectOrCreate: role.permissions.map((p) => ({
              where: { name: p },
              create: { name: p },
            })),
          },
        },
      });
    }
  },
};
