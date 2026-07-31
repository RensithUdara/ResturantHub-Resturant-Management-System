import { useMemo, useState } from "react";
import { ChevronDown, Save, ShieldCheck } from "lucide-react";
import { useRoles } from "../../hooks/useRoles.js";
import styles from "./Roles.module.css";

const PERMISSION_LABELS = {
  "dashboard.view": "View dashboard",
  "orders.view": "View orders",
  "orders.create": "Create orders",
  "orders.update": "Update orders",
  "menu.view": "View menu",
  "menu.manage": "Manage menu",
  "kitchen.view": "View kitchen",
  "kitchen.update": "Update kitchen",
  "tables.view": "View tables",
  "tables.manage": "Manage tables",
  "tables.status": "Change table status",
  "inventory.view": "View inventory",
  "inventory.manage": "Manage inventory",
  "employees.view": "View employees",
  "employees.manage": "Manage employees",
  "roles.manage": "Manage roles",
  "settings.view": "View settings",
};

const groupName = (permission) => permission.split(".")[0];
const prettyGroup = (group) => group.charAt(0).toUpperCase() + group.slice(1);

export default function Roles() {
  const { roles, permissions, isLoading, isError, error, updateRolePermissions } =
    useRoles();
  const [drafts, setDrafts] = useState({});
  const [savingRole, setSavingRole] = useState("");
  const [expandedRoles, setExpandedRoles] = useState(() => new Set());
  const [expandedGroups, setExpandedGroups] = useState(() => new Set());

  const groupedPermissions = useMemo(
    () =>
      permissions.reduce((groups, permission) => {
        const group = groupName(permission);
        groups[group] = [...(groups[group] ?? []), permission];
        return groups;
      }, {}),
    [permissions],
  );

  const selectedFor = (role) => drafts[role.key] ?? role.permissions ?? [];

  const togglePermission = (role, permission) => {
    const selected = selectedFor(role);
    const next = selected.includes(permission)
      ? selected.filter((item) => item !== permission)
      : [...selected, permission];

    setDrafts((prev) => ({ ...prev, [role.key]: next }));
  };

  const saveRole = async (role) => {
    setSavingRole(role.key);
    try {
      await updateRolePermissions({
        key: role.key,
        permissions: selectedFor(role),
      });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[role.key];
        return next;
      });
    } finally {
      setSavingRole("");
    }
  };

  const toggleExpanded = (roleKey) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleKey)) {
        next.delete(roleKey);
        setExpandedGroups((groups) => {
          const filtered = new Set(groups);
          for (const key of filtered) {
            if (key.startsWith(`${roleKey}:`)) {
              filtered.delete(key);
            }
          }
          return filtered;
        });
      } else {
        next.add(roleKey);
      }
      return next;
    });
  };

  const toggleGroup = (roleKey, group) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      const key = `${roleKey}:${group}`;
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (isLoading) {
    return <p className={styles.state}>Loading role permissions...</p>;
  }

  if (isError) {
    return <p className={styles.error}>{error?.message || "Could not load roles."}</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Role Permissions</h1>
          <p className={styles.subtitle}>
            Control which restaurant functions each employee role can access.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {roles.map((role) => {
          const isAdmin = role.key === "admin";
          const selected = selectedFor(role);
          const changed = Boolean(drafts[role.key]);
          const expanded = expandedRoles.has(role.key);
          const allowedCount = isAdmin ? permissions.length : selected.length;

          return (
            <section key={role.key} className={styles.card}>
              <button
                type="button"
                className={styles.cardHeader}
                onClick={() => toggleExpanded(role.key)}
                aria-expanded={expanded}
              >
                <div className={styles.roleIcon}>
                  <ShieldCheck size={18} />
                </div>
                <div className={styles.roleCopy}>
                  <h2 className={styles.roleTitle}>{role.label}</h2>
                  <p className={styles.roleText}>{role.description}</p>
                  <span className={styles.permissionCount}>
                    {allowedCount} permissions enabled
                  </span>
                </div>
                <span
                  className={styles.expandBtn}
                  aria-hidden
                  title={expanded ? "Collapse" : "Expand"}
                >
                  <ChevronDown
                    size={18}
                    className={expanded ? styles.chevronOpen : ""}
                  />
                </span>
              </button>

              {expanded && (
                <>
                  <div className={styles.permissionGroups}>
                    {Object.entries(groupedPermissions).map(([group, items]) => {
                      const groupKey = `${role.key}:${group}`;
                      const groupExpanded = expandedGroups.has(groupKey);
                      const groupEnabled = isAdmin
                        ? items.length
                        : items.filter((permission) =>
                            selected.includes(permission),
                          ).length;

                      return (
                        <div key={group} className={styles.group}>
                          <button
                            type="button"
                            className={styles.groupHeader}
                            onClick={() => toggleGroup(role.key, group)}
                            aria-expanded={groupExpanded}
                          >
                            <span>
                              <span className={styles.groupTitle}>
                                {prettyGroup(group)}
                              </span>
                              <span className={styles.groupMeta}>
                                {groupEnabled} of {items.length} enabled
                              </span>
                            </span>
                            <ChevronDown
                              size={17}
                              className={groupExpanded ? styles.chevronOpen : ""}
                            />
                          </button>

                          {groupExpanded && (
                            <div className={styles.permissionList}>
                              {items.map((permission) => (
                                <label
                                  key={permission}
                                  className={`${styles.permission} ${
                                    isAdmin ? styles.disabled : ""
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isAdmin || selected.includes(permission)}
                                    disabled={isAdmin}
                                    onChange={() =>
                                      togglePermission(role, permission)
                                    }
                                  />
                                  <span>
                                    {PERMISSION_LABELS[permission] ?? permission}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className={styles.saveBtn}
                    disabled={isAdmin || !changed || savingRole === role.key}
                    onClick={() => saveRole(role)}
                  >
                    <Save size={15} />
                    {savingRole === role.key ? "Saving..." : "Save Permissions"}
                  </button>
                </>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
