import express from "express";
import authenticationMiddleware from "../../middleware/authMiddleware";
import { requirePermission } from "../../middleware/permissionMiddleware";
import { Permission } from "../../types/permission";
import {
  listUsers,
  updateUser,
  deleteUser,
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  assignRole,
  removeRole,
  listBans,
  createBan,
  updateBan,
  removeBan,
} from "../../controllers/admin";

const router = express.Router();

router.use(authenticationMiddleware);

// User Management
router.get("/users", requirePermission(Permission.VIEW_USERS), listUsers);
router.patch(
  "/users/:userId",
  requirePermission(Permission.MANAGE_USERS),
  updateUser
);
router.delete(
  "/users/:userId",
  requirePermission(Permission.MANAGE_USERS),
  deleteUser
);

// Role Management
router.get("/roles", requirePermission(Permission.VIEW_ROLES), listRoles);
router.post("/roles", requirePermission(Permission.MANAGE_ROLES), createRole);
router.patch(
  "/roles/:roleId",
  requirePermission(Permission.MANAGE_ROLES),
  updateRole
);
router.delete(
  "/roles/:roleId",
  requirePermission(Permission.MANAGE_ROLES),
  deleteRole
);

// User-Role Management
router.post(
  "/users/:userId/roles",
  requirePermission(Permission.MANAGE_USERS),
  assignRole
);
router.delete(
  "/users/:userId/roles/:roleId",
  requirePermission(Permission.MANAGE_USERS),
  removeRole
);

// Ban Management
router.get("/bans", requirePermission(Permission.VIEW_BANS), listBans);
router.post(
  "/users/:userId/ban",
  requirePermission(Permission.MANAGE_BANS),
  createBan
);
router.patch(
  "/bans/:banId",
  requirePermission(Permission.MANAGE_BANS),
  updateBan
);
router.delete(
  "/bans/:banId",
  requirePermission(Permission.MANAGE_BANS),
  removeBan
);

export default router;
