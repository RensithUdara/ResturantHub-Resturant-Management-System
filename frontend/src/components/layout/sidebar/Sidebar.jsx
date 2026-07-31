import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  ChefHat,
  Grid2x2,
  Package,
  Users,
  ShieldCheck,
  Settings,
} from "lucide-react";
import NavItem from "./NavItem.jsx";
import { hasPermission } from "../../../utils/auth.js";
import logo from "../../../assets/logo.png";
import styles from "./Sidebar.module.css";

const navLinks = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    permission: "dashboard.view",
    end: true,
  },
  {
    to: "/orders",
    icon: ShoppingCart,
    permission: "orders.view",
    label: "Orders",
  },
  {
    to: "/menu",
    icon: UtensilsCrossed,
    permission: "menu.view",
    label: "Menu",
  },
  { to: "/kitchen", icon: ChefHat, permission: "kitchen.view", label: "Kitchen" },
  { to: "/tables", icon: Grid2x2, permission: "tables.view", label: "Tables" },
  {
    to: "/inventory",
    icon: Package,
    permission: "inventory.view",
    label: "Inventory",
  },
  { to: "/employees", icon: Users, permission: "employees.view", label: "Employees" },
  { to: "/roles", icon: ShieldCheck, permission: "roles.manage", label: "Roles" },
];

export default function Sidebar({ isOpen, onClose }) {
  const filteredLinks = navLinks.filter((item) => hasPermission(item.permission));

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.logo}>
          <img src={logo} alt="RestaurantHub logo" className={styles.logoImg} />
          <span className={styles.logoText}>RestaurantHub</span>
        </div>

        <nav className={styles.nav}>
          {filteredLinks.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className={styles.bottom}>
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>
      </aside>
    </>
  );
}
