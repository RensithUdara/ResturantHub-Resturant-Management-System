import Role from "../models/roleModel.js";
import { DEFAULT_ROLES } from "../config/roles.js";

export async function seedDefaultRoles() {
  await Promise.all(
    DEFAULT_ROLES.map((role) =>
      Role.updateOne(
        { key: role.key },
        { $setOnInsert: role },
        { upsert: true },
      ),
    ),
  );
}
