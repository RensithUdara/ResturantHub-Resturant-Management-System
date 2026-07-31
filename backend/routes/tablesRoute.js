import express from "express";
import {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
} from "../controllers/tablesController.js";
import {
  authinticateUser,
  requirePermission,
} from "../middleware/auth.js";

const router = express.Router();



router.get(
  "/",
  authinticateUser,
  requirePermission("tables.view"),
  getAllTables,
);

router.get(
  "/:id",
  authinticateUser,
  requirePermission("tables.view"),
  getTableById,
);

router.post("/", authinticateUser, requirePermission("tables.manage"), createTable);

router.put(
  "/:id",
  authinticateUser,
  requirePermission("tables.manage"),
  updateTable,
);

router.patch(
  "/:id/status",
  authinticateUser,
  requirePermission("tables.status"),
  updateTableStatus,
);

router.delete("/:id", authinticateUser, requirePermission("tables.manage"), deleteTable);

export default router;
