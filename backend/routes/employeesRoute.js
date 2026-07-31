import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeByName,
  updateEmployeeWorkedHours,
  updateEmployeeSalary,
  resetEmployeeWorkedHours,
  resetAllEmployeesWorkedHours,
  getEmployeeTotalSalary,
} from "../controllers/employeesController.js";
import { authinticateUser, requirePermission } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authinticateUser, requirePermission("employees.view"), getAllEmployees);

router.get("/:id", authinticateUser, requirePermission("employees.view"), getEmployeeById);

router.get(
  "/name/:name",
  authinticateUser,
  requirePermission("employees.view"),
  getEmployeeByName,
);

router.get(
  "/:id/total-salary",
  authinticateUser,
  requirePermission("employees.view"),
  getEmployeeTotalSalary,
);

router.post("/", authinticateUser, requirePermission("employees.manage"), createEmployee);

router.put("/:id", authinticateUser, requirePermission("employees.manage"), updateEmployee);

router.patch(
  "/:id/worked-hours",
  authinticateUser,
  requirePermission("employees.manage"),
  updateEmployeeWorkedHours,
);

router.patch(
  "/:id/salary",
  authinticateUser,
  requirePermission("employees.manage"),
  updateEmployeeSalary,
);

router.patch(
  "/reset-worked-hours/:id",
  authinticateUser,
  requirePermission("employees.manage"),
  resetEmployeeWorkedHours,
);

router.patch(
  "/reset-worked-hours",
  authinticateUser,
  requirePermission("employees.manage"),
  resetAllEmployeesWorkedHours,
);

router.delete("/:id", authinticateUser, requirePermission("employees.manage"), deleteEmployee);

export default router;
