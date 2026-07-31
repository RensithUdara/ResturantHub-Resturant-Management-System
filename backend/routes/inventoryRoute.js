import express from "express";

import {
  getAllInventory,
  getInventoryById,
  getInventoryByName,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";
import { authinticateUser, requirePermission } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  authinticateUser,
  requirePermission("inventory.view"),
  getAllInventory,
);

router.get(
  "/name/:ingredientName",
  authinticateUser,
  requirePermission("inventory.view"),
  getInventoryByName,
);

router.get(
  "/:id",
  authinticateUser,
  requirePermission("inventory.view"),
  getInventoryById,
);

router.post(
  "/",
  authinticateUser,
  requirePermission("inventory.manage"),
  createInventoryItem,
);

router.put(
  "/:id",
  authinticateUser,
  requirePermission("inventory.manage"),
  updateInventoryItem,
);

router.delete(
  "/:id",
  authinticateUser,
  requirePermission("inventory.manage"),
  deleteInventoryItem,
);

export default router;
