import express from "express";
import {
  getAllOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authinticateUser, requirePermission } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authinticateUser, requirePermission("orders.view"), getAllOrders);
router.post(
  "/",
  authinticateUser,
  requirePermission("orders.create"),
  createOrder,
);
router.put(
  "/:id/status",
  authinticateUser,
  requirePermission("orders.update"),
  updateOrderStatus,
);

export default router;
