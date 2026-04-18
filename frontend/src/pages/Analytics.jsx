import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { useSettings } from "../context/SettingsContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const PRIMARY = "#14b8a6";
const MUTED = "#94a3b8";

function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);
}

export default function Analytics() {
  const { settings } = useSettings();
  const light = settings.theme === "light";
  const [monthly, setMonthly] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: s } = await api.get("/user/dashboard/summary");
        if (!cancelled) setSummary(s.data);
        const now = new Date();
        const pts = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const { data: m } = await api.get("/user/analytics/spending", {
            params: { year: d.getFullYear(), month: d.getMonth() + 1 },
          });
          pts.push({
            label: d.toLocaleString("default", { month: "short" }),
            spending: m.data.totalSpending,
          });
        }
        if (!cancelled) setMonthly(pts);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const panel = light ? "glass-panel-light rounded-2xl p-6 card-hover" : "glass-panel rounded-2xl p-6 card-hover";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold tracking-tight ${light ? "text-slate-900" : "text-bank-text"}`}>
          Analytics
        </h1>
        <p className={`mt-1 ${light ? "text-slate-600" : "text-bank-muted"}`}>
          Spending velocity and balance context.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={panel}>
          <h2 className={`mb-4 text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
            Monthly spend
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke={light ? "#e2e8f0" : "#334155"} />
                <XAxis dataKey="label" stroke={MUTED} fontSize={12} />
                <YAxis stroke={MUTED} fontSize={12} />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{
                    background: light ? "#fff" : "#0f172a",
                    border: light ? "1px solid #e2e8f0" : "1px solid #334155",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="spending" fill={PRIMARY} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={panel}
        >
          <h2 className={`mb-4 text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
            Trend
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke={light ? "#e2e8f0" : "#334155"} />
                <XAxis dataKey="label" stroke={MUTED} fontSize={12} />
                <YAxis stroke={MUTED} fontSize={12} />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{
                    background: light ? "#fff" : "#0f172a",
                    border: light ? "1px solid #e2e8f0" : "1px solid #334155",
                    borderRadius: "12px",
                  }}
                />
                <Line type="monotone" dataKey="spending" stroke={PRIMARY} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={panel}>
        <h2 className={`mb-2 text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
          Summary
        </h2>
        <p className={light ? "text-slate-600" : "text-bank-muted"}>
          Total balance {formatCurrency(summary?.totalBalance)} across {summary?.accountCount ?? 0} accounts.
          Estimated monthly burn {formatCurrency(summary?.monthlySpending)}.
        </p>
      </motion.div>
    </div>
  );
}
