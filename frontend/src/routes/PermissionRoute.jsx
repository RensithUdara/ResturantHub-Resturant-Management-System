import { Navigate } from "react-router-dom";
import { hasPermission, isAuthenticated } from "../utils/auth";

export default function PermissionRoute({ permission, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
