import express from "express";
import {
  getAllMenu,
  getMenuById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import {
  authinticateUser,
  requirePermission,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllMenu);
router.get("/:id", authinticateUser, requirePermission("menu.view"), getMenuById);
router.post("/", authinticateUser, requirePermission("menu.manage"), createMenuItem);
router.put("/:id", authinticateUser, requirePermission("menu.manage"), updateMenuItem);
router.delete("/:id", authinticateUser, requirePermission("menu.manage"), deleteMenuItem);

export default router;
