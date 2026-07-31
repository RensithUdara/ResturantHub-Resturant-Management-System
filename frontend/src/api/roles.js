import api from "../lib/axios.js";

export const getRoles = async () => {
  const res = await api.get("/roles");
  return res.data.data;
};

export const updateRolePermissions = async (key, permissions) => {
  const res = await api.put(`/roles/${key}/permissions`, { permissions });
  return res.data.data;
};
