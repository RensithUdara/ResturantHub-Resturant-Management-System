import mongoose from "mongoose";
import { PERMISSIONS } from "../config/roles.js";

const roleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
      validate: {
        validator: (permissions) =>
          permissions.every((permission) => PERMISSIONS.includes(permission)),
        message: "Invalid permission assigned",
      },
    },
    system: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
