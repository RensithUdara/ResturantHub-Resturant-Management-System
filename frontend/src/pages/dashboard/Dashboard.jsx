import {
  AlertTriangle,
  ChefHat,
  Grid2x2,
  PlusCircle,
  ReceiptText,
  ShoppingCart,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/cards/statCard/StatCard.jsx";
import WeeklyRevenueChart from "../../components/charts/weeklyRevenueChart/WeeklyRevenueChart.jsx";
import RecentOrders from "../../components/rows/recentOrdersRow/RecentOrders.jsx";
import QuickLink from "../../components/quickLink/QuickLink.jsx";
import { useDashboard } from "../../hooks/useDashboard.js";
import { formatCurrency } from "../../utils/currency.js";

import styles from "./Dashboard.module.css";

const QUICK_LINKS = [
  {
    label: "New Order",
    description: "Create and manage service orders",
    icon: ShoppingCart,
    to: "/orders",
    color: "#0f766e",
  },
  {
    label: "Menu",
    description: "Add or update menu items",
    icon: UtensilsCrossed,
    to: "/menu",
    color: "#7c3aed",
  },
  {
    label: "Kitchen",
    description: "Track preparation flow",
    icon: ChefHat,
    to: "/kitchen",
    color: "#d97706",
  },
  {
    label: "Tables",
    description: "View table status",
    icon: Grid2x2,
    to: "/tables",
    color: "#2563eb",
  },
];

function DashboardSkeleton() {
  const sk = styles.skeleton;
  return (
    <div className={styles.page}>
      <span className={styles.srOnly}>Loading dashboard...</span>
      <div className={styles.header}>
        <div>
          <div className={`${sk} ${styles.skTitle}`} aria-hidden />
          <div className={`${sk} ${styles.skSubtitle}`} aria-hidden />
        </div>
      </div>

      <div className={styles.statGrid}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.skStat} aria-hidden />
        ))}
      </div>

      <div className={styles.midRow}>
        <div className={styles.skChart} aria-hidden />
        <div className={styles.skPanel} aria-hidden />
      </div>

      <div className={styles.quickGrid}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.skQuick} aria-hidden />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError) {
    const message =
      error?.message || "We couldn't load the dashboard. Try again.";
    return (
      <div className={styles.stateWrap}>
        <div className={`${styles.stateCard} ${styles.stateCardError}`}>
          <p className={styles.stateTitle}>Something went wrong</p>
          <p className={styles.stateHint}>{message}</p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    totalOrders,
    todayIncome,
    activeOrders,
    lowStock,
    weeklyRevenue,
    recentOrders,
  } = data;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Admin Dashboard</p>
          <h1 className={styles.title}>Today at a glance</h1>
          <p className={styles.subtitle}>
            Orders, revenue, kitchen flow, and stock alerts in one place.
          </p>
        </div>
        <button
          type="button"
          className={styles.primaryAction}
          onClick={() => navigate("/menu")}
        >
          <PlusCircle size={17} />
          Add Menu
        </button>
      </div>

      <div className={styles.statGrid}>
        <StatCard
          label="Total Orders"
          value={totalOrders}
          icon={<ReceiptText size={21} />}
        />
        <StatCard
          label="Today's Income"
          value={formatCurrency(todayIncome)}
          icon={<Wallet size={21} />}
        />
        <StatCard
          label="Active Orders"
          value={activeOrders}
          icon={<ChefHat size={21} />}
        />
        <StatCard
          label="Low Stock"
          value={lowStock}
          icon={<AlertTriangle size={21} />}
        />
      </div>

      <div className={styles.midRow}>
        <WeeklyRevenueChart data={weeklyRevenue} />
        <RecentOrders orders={recentOrders} />
      </div>

      <section className={styles.quickSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Quick actions</h2>
          <p className={styles.sectionText}>
            Jump straight into common admin tasks.
          </p>
        </div>
        <div className={styles.quickGrid}>
          {QUICK_LINKS.map((link) => (
            <QuickLink key={link.label} {...link} />
          ))}
        </div>
      </section>
    </div>
  );
}
