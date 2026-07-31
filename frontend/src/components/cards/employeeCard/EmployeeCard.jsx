import { useState } from "react";
import {
  Phone,
  Mail,
  Clock,
  Wallet,
  Pencil,
  Trash2,
  Check,
  X,
  User,
} from "lucide-react";
import { formatCurrency } from "../../../utils/currency.js";
import { useRoles } from "../../../hooks/useRoles.js";
import styles from "./EmployeeCard.module.css";

const ROLE_COLORS = {
  admin: styles.roleAdmin,
  manager: styles.roleAdmin,
  chef: styles.roleChef,
  sous_chef: styles.roleChef,
  waiter: styles.roleWaiter,
  cashier: styles.roleWaiter,
  host: styles.roleWaiter,
  bartender: styles.roleChef,
  inventory_manager: styles.roleAdmin,
  cleaner: styles.roleDefault,
};

export default function EmployeeCard({ employee: emp, onDelete, onEdit }) {
  const { roles } = useRoles();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...emp });
  const roleLabel =
    roles.find((role) => role.key === emp.role)?.label ?? emp.role;

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    onEdit(emp.id, {
      name: form.name,
      role: form.role,
      phoneNumber: form.phoneNumber,
      email: form.email,
      workedHours: Number(form.workedHours),
      salaryPerHour: Number(form.salaryPerHour),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...emp });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={`${styles.card} ${styles.editingCard}`}>
        <div className={styles.cardHeader}>
          <div className={styles.avatar}>
            <User size={20} />
          </div>
          <div className={styles.headerInfo}>
            <input
              className={styles.editInput}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Full name"
            />
            <select
              className={styles.editInput}
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              {roles.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.cardActions}>
            <button
              className={`${styles.btn} ${styles.saveBtn}`}
              onClick={handleSave}
            >
              <Check size={14} />
            </button>
            <button
              className={`${styles.btn} ${styles.cancelBtn}`}
              onClick={handleCancel}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className={styles.editFields}>
          <label className={styles.editLabel}>Phone Number</label>
          <input
            className={styles.editInput}
            value={form.phoneNumber}
            onChange={(e) => set("phoneNumber", e.target.value)}
          />

          <label className={styles.editLabel}>Email</label>
          <input
            className={styles.editInput}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />

          <label className={styles.editLabel}>Hours Worked</label>
          <input
            className={styles.editInput}
            type="number"
            value={form.workedHours}
            onChange={(e) => set("workedHours", e.target.value)}
          />

          <label className={styles.editLabel}>Salary / Hour (Rs.)</label>
          <input
            className={styles.editInput}
            type="number"
            value={form.salaryPerHour}
            onChange={(e) => set("salaryPerHour", e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          <User size={20} />
        </div>
        <div className={styles.headerInfo}>
          <span className={styles.name}>{emp.name}</span>
          <span
            className={`${styles.roleBadge} ${ROLE_COLORS[emp.role] ?? styles.roleDefault}`}
          >
            {roleLabel}
          </span>
        </div>
        <div className={styles.cardActions}>
          <button
            className={`${styles.btn} ${styles.editBtn}`}
            onClick={() => setEditing(true)}
          >
            <Pencil size={14} />
          </button>
          <button
            className={`${styles.btn} ${styles.deleteBtn}`}
            onClick={() => onDelete(emp.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <Phone size={13} className={styles.infoIcon} />
          <span className={styles.infoText}>{emp.phoneNumber}</span>
        </div>
        {emp.email && (
          <div className={styles.infoRow}>
            <Mail size={13} className={styles.infoIcon} />
            <span className={styles.infoText}>{emp.email}</span>
          </div>
        )}
        <div className={styles.infoRow}>
          <Clock size={13} className={styles.infoIcon} />
          <span className={styles.infoText}>{emp.workedHours}h worked</span>
        </div>
        <div className={styles.infoRow}>
          <Wallet size={13} className={styles.infoIcon} />
          <span className={styles.infoText}>
            {formatCurrency(emp.salaryPerHour * emp.workedHours)}/mo
          </span>
        </div>
      </div>
    </div>
  );
}
