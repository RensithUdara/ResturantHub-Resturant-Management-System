import { LogOut, Moon, Palette, ShieldCheck, Sun } from "lucide-react";
import SettingsSection from "../../components/sections/settingsSection/SettingsSection.jsx";
import ToggleRow from "../../components/rows/toggleRow/ToggleRow.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../store/themeSlice";
import { logout } from "../../utils/auth.js";
import styles from "./Settings.module.css";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const darkMode = theme === "dark";

  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.pageSubtitle}>
            Manage your console appearance and account session.
          </p>
        </div>
        <div className={styles.introIcon} aria-hidden>
          <Palette size={22} />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <SettingsSection label="Appearance">
            <ToggleRow
              icon={darkMode ? <Moon size={18} /> : <Sun size={18} />}
              label="Dark Mode"
              description="Toggle dark / light theme for the console"
              checked={darkMode}
              onChange={(val) => dispatch(setTheme(val ? "dark" : "light"))}
            />
          </SettingsSection>
        </div>

        <div className={styles.card}>
          <SettingsSection label="Session">
            <div className={styles.sessionHeader}>
              <span className={styles.sessionIcon}>
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 className={styles.sectionTitle}>Signed-in session</h2>
                <p className={styles.sectionHint}>
                  Sign out removes your saved token from this browser. You will
                  need to sign in again to use the dashboard.
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.signOutBtn}
              onClick={handleSignOut}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
