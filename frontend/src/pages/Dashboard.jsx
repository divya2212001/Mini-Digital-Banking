import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: s } = await api.get("/user/dashboard/summary");
        if (!cancelled) setSummary(s.data);

        const now = new Date();
        const points = [];
        for (let i = 2; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const { data: m } = await api.get("/user/analytics/spending", {
            params: { year: d.getFullYear(), month: d.getMonth() + 1 },
          });
          points.push({
            label: `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`,
            spending: m.data.totalSpending,
          });
        }
        if (!cancelled) setChartData(points);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || "Failed to load dashboard");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-slate-500 mb-8">Overview of your accounts and spending.</p>
      {error && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-xs uppercase text-slate-500">Total balance</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-400">
            {formatCurrency(summary?.totalBalance)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-xs uppercase text-slate-500">Accounts</p>
          <p className="text-2xl font-semibold mt-1">{summary?.accountCount ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-xs uppercase text-slate-500">Spending (this month)</p>
          <p className="text-2xl font-semibold mt-1 text-rose-300">
            {formatCurrency(summary?.monthlySpending)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-medium mb-4">Monthly spending (last 3 months)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                formatter={(v) => formatCurrency(v)}
              />
              <Bar dataKey="spending" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
