import Role from "../models/roleModel.js";
import { PERMISSIONS } from "../config/roles.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ label: 1 });
    return successResponse(res, "Roles fetched successfully", {
      permissions: PERMISSIONS,
      roles,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateRolePermissions = async (req, res) => {
  try {
    const { key } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return errorResponse(res, "Permissions must be an array", 400);
    }

    const invalidPermissions = permissions.filter(
      (permission) => !PERMISSIONS.includes(permission),
    );

    if (invalidPermissions.length > 0) {
      return errorResponse(
        res,
        `Invalid permissions: ${invalidPermissions.join(", ")}`,
        400,
      );
    }

    if (key === "admin") {
      return errorResponse(res, "Admin permissions cannot be changed", 400);
    }

    const role = await Role.findOneAndUpdate(
      { key },
      { permissions },
      { new: true, runValidators: true },
    );

    if (!role) {
      return errorResponse(res, "Role not found", 404);
    }

    return successResponse(res, "Role permissions updated", role);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
