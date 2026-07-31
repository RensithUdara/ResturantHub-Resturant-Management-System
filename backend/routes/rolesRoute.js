import express from "express";
import { getRoles, updateRolePermissions } from "../controllers/rolesController.js";
import { authinticateUser, requirePermission } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getRoles);
router.put(
  "/:key/permissions",
  authinticateUser,
  requirePermission("roles.manage"),
  updateRolePermissions,
);

export default router;
