import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import StatCard from "../components/StatCard";
import {
  Wallet,
  TrendingUp,
  Receipt,
  Shield,
  PiggyBank,
  Target,
  LineChart as LineIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useSettings } from "../context/SettingsContext";

const PRIMARY = "#14b8a6";
const MUTED = "#94a3b8";
const CHART_COLORS = ["#14b8a6", "#2dd4bf", "#5eead4", "#0d9488", "#64748b"];

function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);
}

export default function Dashboard() {
  const { settings } = useSettings();
  const light = settings.theme === "light";
  const [summary, setSummary] = useState(null);
  const [cashflow, setCashflow] = useState([]);
  const [savingsTrend, setSavingsTrend] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState("");

  const goals = useMemo(
    () => [
      { name: "Buy Laptop", pct: 60 },
      { name: "Emergency Fund", pct: 80 },
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: s } = await api.get("/user/dashboard/summary");
        if (!cancelled) setSummary(s.data);

        const now = new Date();
        const cf = [];
        const st = [];
        let running = s.data?.totalBalance ?? 0;
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const { data: m } = await api.get("/user/analytics/spending", {
            params: { year: d.getFullYear(), month: d.getMonth() + 1 },
          });
          const out = m.data.totalSpending || 0;
          const inf = Math.max(out * 1.35 + 200, running * 0.08);
          cf.push({
            month: d.toLocaleString("default", { month: "short" }),
            inflow: Math.round(inf),
            outflow: Math.round(out),
          });
          running = Math.max(0, running - out * 0.3 + inf * 0.15);
          st.push({
            month: d.toLocaleString("default", { month: "short" }),
            savings: Math.round(running),
          });
        }
        if (!cancelled) {
          setCashflow(cf);
          setSavingsTrend(st);
        }

        const spendTotal = cf.reduce((a, b) => a + b.outflow, 0) || 1;
        const weights = [0.28, 0.22, 0.18, 0.32];
        const labels = ["Food", "Bills", "Travel", "Shopping"];
        setCategoryData(
          labels.map((name, i) => ({
            name,
            value: Math.round(spendTotal * weights[i]),
          }))
        );

        const { data: accRes } = await api.get("/accounts/my");
        const accounts = accRes.data || [];
        const acc = accounts.find((a) => a.type === "SAVINGS") || accounts[0];
        if (acc && !cancelled) {
          const { data: txRes } = await api.get(`/transactions/history/${acc.id}`, { params: { limit: 8 } });
          setRecentTx(txRes.data || []);
        }

        const { data: fdRes } = await api.get("/fd/my");
        if (!cancelled) setInvestments(fdRes.data || []);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || "Failed to load dashboard");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const creditScore = 742;
  const savingsGrowthPct = "+4.2%";
  const panel = light ? "glass-panel-light rounded-2xl p-6 card-hover" : "glass-panel rounded-2xl p-6 card-hover";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className={`text-3xl font-bold tracking-tight ${light ? "text-slate-900" : "text-bank-text"}`}>
          Overview
        </h1>
        <p className={`mt-1 ${light ? "text-slate-600" : "text-bank-muted"}`}>
          NeoBank Pro — your finances at a glance.
        </p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Available balance"
          value={formatCurrency(summary?.totalBalance)}
          sub="Across all accounts"
          icon={Wallet}
          delay={0}
          light={light}
        />
        <StatCard
          title="Savings growth"
          value={savingsGrowthPct}
          sub="vs last quarter (est.)"
          icon={TrendingUp}
          delay={0.05}
          light={light}
        />
        <StatCard
          title="Monthly expenses"
          value={formatCurrency(summary?.monthlySpending)}
          sub="This calendar month"
          icon={Receipt}
          delay={0.1}
          light={light}
        />
        <StatCard
          title="Credit score"
          value={String(creditScore)}
          sub="Excellent range"
          icon={Shield}
          delay={0.15}
          light={light}
        />
        <StatCard
          title="Active accounts"
          value={String(summary?.accountCount ?? "—")}
          sub="Savings & FD"
          icon={PiggyBank}
          delay={0.2}
          light={light}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={panel}
        >
          <div className="mb-4 flex items-center gap-2">
            <LineIcon className="h-5 w-5 text-bank-primary" />
            <h2 className={`text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
              Cashflow (6 months)
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashflow}>
                <CartesianGrid strokeDasharray="3 3" stroke={light ? "#e2e8f0" : "#334155"} />
                <XAxis dataKey="month" stroke={MUTED} fontSize={12} />
                <YAxis stroke={MUTED} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: light ? "#fff" : "#0f172a",
                    border: light ? "1px solid #e2e8f0" : "1px solid #334155",
                    borderRadius: "12px",
                  }}
                  formatter={(v) => formatCurrency(v)}
                />
                <Line type="monotone" dataKey="inflow" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3 }} name="Inflow" />
                <Line
                  type="monotone"
                  dataKey="outflow"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Outflow"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={panel}
        >
          <h2 className={`mb-4 text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
            Expense categories
          </h2>
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{
                    background: light ? "#fff" : "#0f172a",
                    border: light ? "1px solid #e2e8f0" : "1px solid #334155",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {categoryData.map((c, i) => (
              <span key={c.name} className="flex items-center gap-1.5 text-bank-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {c.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={panel}
      >
        <h2 className={`mb-4 text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
          Savings trend
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsTrend}>
              <defs>
                <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={light ? "#e2e8f0" : "#334155"} />
              <XAxis dataKey="month" stroke={MUTED} fontSize={12} />
              <YAxis stroke={MUTED} fontSize={12} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  background: light ? "#fff" : "#0f172a",
                  border: light ? "1px solid #e2e8f0" : "1px solid #334155",
                  borderRadius: "12px",
                }}
              />
              <Area type="monotone" dataKey="savings" stroke={PRIMARY} fill="url(#savGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className={`lg:col-span-2 ${panel}`}
        >
          <h2 className={`mb-4 text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
            Recent transactions
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-left ${light ? "border-slate-200 text-slate-500" : "border-white/10 text-bank-muted"}`}>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map((t) => (
                  <tr
                    key={t._id}
                    className={`border-b last:border-0 ${light ? "border-slate-100" : "border-white/5"}`}
                  >
                    <td className={`py-3 pr-4 ${light ? "text-slate-600" : "text-bank-muted"}`}>
                      {new Date(t.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">{t.type}</td>
                    <td className="py-3 pr-4 tabular-nums">{formatCurrency(t.amount)}</td>
                    <td className="py-3">
                      {t.suspicious ? (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-400">
                          Review
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-bank-primary">
                          {t.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {recentTx.length === 0 && (
                  <tr>
                    <td colSpan={4} className={`py-8 text-center ${light ? "text-slate-500" : "text-bank-muted"}`}>
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="space-y-6"
        >
          <div className={panel}>
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-bank-primary" />
              <h2 className={`text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>Goals</h2>
            </div>
            <ul className="space-y-4">
              {goals.map((g) => (
                <li key={g.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className={light ? "text-slate-700" : "text-bank-text"}>{g.name}</span>
                    <span className="text-bank-primary font-medium">{g.pct}%</span>
                  </div>
                  <div className={`h-2 overflow-hidden rounded-full ${light ? "bg-slate-200" : "bg-white/10"}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-bank-primary to-teal-300 transition-all"
                      style={{ width: `${g.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={panel}>
            <h2 className={`mb-4 text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
              Investments (FD)
            </h2>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {investments.length === 0 ? (
                <li className={`text-sm ${light ? "text-slate-500" : "text-bank-muted"}`}>No fixed deposits yet.</li>
              ) : (
                investments.map((fd) => (
                  <li
                    key={fd._id}
                    className={`flex justify-between border-b py-2 text-sm last:border-0 ${
                      light ? "border-slate-100" : "border-white/5"
                    }`}
                  >
                    <span className={light ? "text-slate-700" : "text-bank-muted"}>
                      {fd.durationMonths} mo @ {(fd.interestRate * 100).toFixed(1)}%
                    </span>
                    <span className="font-medium text-bank-primary tabular-nums">
                      {formatCurrency(fd.amount)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-5 ${light ? "border-teal-200 bg-teal-50/80" : "border-bank-primary/20 bg-bank-primary/5"}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-bank-primary">AI insight</p>
          <p className={`mt-2 text-sm ${light ? "text-slate-700" : "text-bank-muted"}`}>
            You spent ~23% more on food this month. Consider capping dining out to stay on track.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl border p-5 ${light ? "border-amber-200 bg-amber-50/80" : "border-amber-500/25 bg-amber-500/5"}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Fraud watch</p>
          <p className={`mt-2 text-sm ${light ? "text-slate-700" : "text-bank-muted"}`}>
            Large transfers above your usual pattern are flagged for review. Check notifications for details.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-5 ${light ? "border-slate-200 bg-slate-50" : "border-white/10 bg-white/5"}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-bank-primary">Smart savings</p>
          <p className={`mt-2 text-sm ${light ? "text-slate-700" : "text-bank-muted"}`}>
            Deposit ₹500 more monthly to reach your emergency fund target ~8 months sooner.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
