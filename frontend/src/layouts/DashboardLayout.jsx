import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/accounts", label: "My Accounts" },
  { to: "/deposit", label: "Deposit" },
  { to: "/withdraw", label: "Withdraw" },
  { to: "/transfer", label: "Transfer" },
  { to: "/transactions", label: "Transactions" },
  { to: "/fixed-deposit", label: "Fixed Deposit" },
  { to: "/profile", label: "Profile" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/80 backdrop-blur flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="text-lg font-semibold tracking-tight text-emerald-400">
            MiniBank
          </Link>
          <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-lg border border-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
