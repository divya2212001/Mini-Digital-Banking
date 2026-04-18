import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Receipt,
  BarChart3,
  User,
  Settings,
  LogOut,
  PiggyBank,
  Landmark,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SettingsProvider, useSettings } from "../context/SettingsContext";
import TopNavbar from "../components/TopNavbar";

const mainNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Wallet", icon: Wallet },
  { to: "/transfer", label: "Transfer", icon: ArrowLeftRight },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

const moreNav = [
  { to: "/deposit", label: "Deposit", icon: PiggyBank },
  { to: "/withdraw", label: "Withdraw", icon: Landmark },
  { to: "/fixed-deposit", label: "Fixed Deposit", icon: Sparkles },
];

function DashboardShell() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const light = settings.theme === "light";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const shellBg = light ? "bg-slate-100 min-h-screen text-slate-900" : "bg-bank-bg min-h-screen text-bank-text";

  const linkClass = ({ isActive }) => {
    const base =
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200";
    if (light) {
      return `${base} ${
        isActive
          ? "bg-teal-100 text-teal-900 shadow-md border border-teal-200/80"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`;
    }
    return `${base} ${
      isActive
        ? "bg-bank-primary/15 text-bank-primary border border-bank-primary/25 shadow-lg shadow-bank-primary/5"
        : "text-bank-muted hover:bg-white/5 hover:text-bank-text"
    }`;
  };

  const asideWidth = collapsed ? "md:w-[76px]" : "md:w-64";

  return (
    <div className={`flex ${shellBg}`}>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 flex h-screen flex-col border-r transition-all duration-300 md:translate-x-0 ${asideWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          light
            ? "border-slate-200/80 bg-white/90 backdrop-blur-xl md:shadow-sm"
            : "border-white/10 glass-panel md:bg-bank-card/40"
        }`}
      >
        <div
          className={`flex h-16 items-center justify-between gap-2 border-b px-4 ${
            light ? "border-slate-200/80" : "border-white/10"
          }`}
        >
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-lg font-bold tracking-tight bg-gradient-to-r from-bank-primary to-teal-300 bg-clip-text text-transparent">
                NeoBank Pro
              </p>
              <p className={`text-[10px] uppercase tracking-widest ${light ? "text-slate-500" : "text-bank-muted"}`}>
                Premium banking
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={`hidden md:flex rounded-lg p-1.5 ${light ? "hover:bg-slate-100" : "hover:bg-white/5"}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              onClick={() => setMobileOpen(false)}
              className={linkClass}
            >
              <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          <div
            className={`pt-3 mt-3 border-t ${light ? "border-slate-200" : "border-white/10"}`}
          >
            <p
              className={`px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider ${
                light ? "text-slate-400" : "text-bank-muted/80"
              }`}
            >
              {!collapsed && "More services"}
            </p>
            {moreNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className={`border-t p-3 ${light ? "border-slate-200" : "border-white/10"}`}>
          <button
            type="button"
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
              light
                ? "text-rose-700 hover:bg-rose-50"
                : "text-rose-300/90 hover:bg-white/5"
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.75} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        <TopNavbar light={light} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SettingsProvider>
      <DashboardShell />
    </SettingsProvider>
  );
}
