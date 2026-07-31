import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layout/rootLayout/RootLayout.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Orders from "../pages/orders/Orders.jsx";
import Menu from "../pages/menu/Menu.jsx";
import Kitchen from "../pages/kitchen/Kitchen.jsx";
import Tables from "../pages/tables/Tables.jsx";
import Inventory from "../pages/inventory/Inventory.jsx";
import Employees from "../pages/employees/Employees.jsx";
import Roles from "../pages/roles/Roles.jsx";
import Settings from "../pages/settings/Settings.jsx";
import Login from "../pages/login/Login.jsx";
import Register from "../pages/register/Register.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import PermissionRoute from "../routes/PermissionRoute.jsx";
import Unauthorized from "../pages/unauthorized/Unauthorized.jsx";
import NotFound from "../pages/notFound/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <PermissionRoute permission="dashboard.view">
            <Dashboard />
          </PermissionRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <PermissionRoute permission="orders.view">
            <Orders />
          </PermissionRoute>
        ),
      },
      {
        path: "menu",
        element: (
          <PermissionRoute permission="menu.view">
            <Menu />
          </PermissionRoute>
        ),
      },
      {
        path: "kitchen",
        element: (
          <PermissionRoute permission="kitchen.view">
            <Kitchen />
          </PermissionRoute>
        ),
      },
      {
        path: "tables",
        element: (
          <PermissionRoute permission="tables.view">
            <Tables />
          </PermissionRoute>
        ),
      },
      {
        path: "inventory",
        element: (
          <PermissionRoute permission="inventory.view">
            <Inventory />
          </PermissionRoute>
        ),
      },
      {
        path: "employees",
        element: (
          <PermissionRoute permission="employees.view">
            <Employees />
          </PermissionRoute>
        ),
      },
      {
        path: "roles",
        element: (
          <PermissionRoute permission="roles.manage">
            <Roles />
          </PermissionRoute>
        ),
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
