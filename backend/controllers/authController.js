import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from "../utils/response.js";
import Role from "../models/roleModel.js";

export const registerUser = async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { name, email, password } = req.body;
    const requestedRole = req.body.role?.toLowerCase();

    const userCount = await User.countDocuments();

    let finalRole;

    if (userCount === 0) {
      finalRole = "admin";
    } else {
      if (!req.user || req.user.role !== "admin") {
        return errorResponse(res, "Only admin can create users", 403);
      }

      const allowedRoles = await Role.find({ key: { $ne: "admin" } }).distinct(
        "key",
      );

      if (!allowedRoles.includes(requestedRole)) {
        return errorResponse(res, "Invalid role", 400);
      }

      finalRole = requestedRole;
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: finalRole,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const roleData = await Role.findOne({ key: newUser.role });

    return successResponse(res, "User created successfully", {
      user: {
        userId: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        permissions: roleData?.permissions ?? [],
      },
      token,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const loginUser = async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return errorResponse(res, "User is not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    const roleData = await Role.findOne({ key: user.role });
    const permissions = roleData?.permissions ?? [];

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return successResponse(res, "Login successfully", {
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions,
      },
      token,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
