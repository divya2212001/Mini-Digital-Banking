import React, { useEffect, useState, useRef } from "react";
import { Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";

export default function TopNavbar({ light, onMenuClick }) {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("theme-light", settings.theme === "light");
  }, [settings.theme]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: accRes } = await api.get("/accounts/my");
        const list = accRes.data || [];
        const acc = list.find((a) => a.type === "SAVINGS") || list[0];
        if (!acc || cancelled) return;
        const { data: txRes } = await api.get(`/transactions/history/${acc.id}`, {
          params: { limit: 30 },
        });
        const rows = txRes.data || [];
        const items = [];
        rows.filter((t) => t.suspicious).forEach((t) => {
          items.push({
            id: t._id,
            type: "fraud",
            text: `Large ${t.type.toLowerCase()} flagged for review — $${Number(t.amount).toLocaleString()}`,
            time: t.timestamp,
          });
        });
        if (items.length === 0) {
          items.push({
            id: "ai-1",
            type: "insight",
            text: "AI: You spent ~23% more on food this month vs last (category estimate).",
            time: new Date().toISOString(),
          });
          items.push({
            id: "save-1",
            type: "insight",
            text: "Smart save: Deposit ₹500 more monthly to reach your emergency goal ~8 months sooner.",
            time: new Date().toISOString(),
          });
        }
        if (!cancelled) setAlerts(items.slice(0, 6));
      } catch {
        if (!cancelled) {
          setAlerts([
            {
              id: "tip",
              type: "insight",
              text: "Connect accounts to see AI spending insights here.",
              time: new Date().toISOString(),
            },
          ]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function toggleTheme() {
    const next = settings.theme === "dark" ? "light" : "dark";
    await updateSettings({ theme: next });
  }

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6 ${
        light
          ? "border-slate-200/80 bg-white/70 backdrop-blur-xl"
          : "border-white/10 bg-bank-bg/80 backdrop-blur-xl"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className={`md:hidden rounded-lg p-2 ${light ? "hover:bg-slate-100" : "hover:bg-white/5"}`}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              light ? "text-slate-900" : "text-bank-text"
            }`}
          >
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome"}
          </p>
          <p className={`text-xs truncate ${light ? "text-slate-500" : "text-bank-muted"}`}>
            {user?.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className={`rounded-xl p-2.5 transition-colors ${
            light ? "hover:bg-slate-100 text-slate-700" : "hover:bg-white/5 text-bank-muted"
          }`}
          aria-label="Toggle theme"
        >
          {settings.theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`relative rounded-xl p-2.5 transition-colors ${
              light ? "hover:bg-slate-100 text-slate-700" : "hover:bg-white/5 text-bank-muted"
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <span
                className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ${
                  light ? "ring-white" : "ring-bank-bg"
                }`}
              />
            )}
          </button>
          {open && (
            <div
              className={`absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border shadow-2xl z-50 ${
                light
                  ? "border-slate-200 bg-white"
                  : "border-white/10 bg-bank-card/95 backdrop-blur-xl"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b px-4 py-3 ${
                  light ? "border-slate-100" : "border-white/10"
                }`}
              >
                <span className={`text-sm font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
                  Alerts & insights
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={`p-1 rounded-lg ${light ? "hover:bg-slate-100" : "hover:bg-white/5"}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ul className="max-h-72 overflow-y-auto py-2">
                {alerts.length === 0 ? (
                  <li className={`px-4 py-6 text-center text-sm ${light ? "text-slate-500" : "text-bank-muted"}`}>
                    No new notifications
                  </li>
                ) : (
                  alerts.map((a) => (
                    <li
                      key={a.id}
                      className={`px-4 py-3 text-sm border-b last:border-0 ${
                        light ? "border-slate-50 text-slate-700" : "border-white/5 text-bank-muted"
                      }`}
                    >
                      <span
                        className={`mr-2 text-xs font-semibold uppercase ${
                          a.type === "fraud" ? "text-amber-400" : "text-bank-primary"
                        }`}
                      >
                        {a.type === "fraud" ? "Risk" : "AI"}
                      </span>
                      {a.text}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
