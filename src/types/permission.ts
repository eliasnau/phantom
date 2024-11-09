import { UserAuth } from "./auth";

export enum Permission {
  // User Management
  MANAGE_USERS = "users:manage",
  VIEW_USERS = "users:view",

  // Role Management
  MANAGE_ROLES = "roles:manage",
  VIEW_ROLES = "roles:view",

  // Ban Management
  MANAGE_BANS = "bans:manage",
  VIEW_BANS = "bans:view",

  // Session Management
  MANAGE_SESSIONS = "sessions:manage",
  VIEW_ALL_SESSIONS = "sessions:view:all",

  // System Settings
  MANAGE_SETTINGS = "settings:manage",
  VIEW_SETTINGS = "settings:view",
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface UserWithRoles extends UserAuth {
  roles: RoleWithPermissions[];
}
