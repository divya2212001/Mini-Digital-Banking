import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const TERMS = [6, 12, 24];

export default function FixedDeposit() {
  const [list, setList] = useState([]);
  const [amount, setAmount] = useState("");
  const [durationMonths, setDurationMonths] = useState(12);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const { data } = await api.get("/fd/my");
    setList(data.data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await api.post("/fd/create", {
        amount: Number(amount),
        durationMonths,
      });
      setMsg("Fixed deposit created.");
      setAmount("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create FD");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Fixed Deposit</h1>
      <p className="text-slate-500 mb-8">Lock funds for 6, 12, or 24 months at quoted rates.</p>

      <form onSubmit={submit} className="max-w-md space-y-4 mb-12">
        <div>
          <label className="block text-xs uppercase text-slate-500 mb-1">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs uppercase text-slate-500 mb-1">Term (months)</label>
          <select
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
            value={durationMonths}
            onChange={(e) => setDurationMonths(Number(e.target.value))}
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t} months
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        {msg && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {msg}
          </div>
        )}
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Create FD
        </button>
      </form>

      <h2 className="text-lg font-medium mb-4">Your fixed deposits</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80 text-left text-slate-400">
            <tr>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">Months</th>
              <th className="px-4 py-3">Maturity</th>
            </tr>
          </thead>
          <tbody>
            {list.map((fd) => (
              <tr key={fd._id} className="border-t border-slate-800">
                <td className="px-4 py-3">${fd.amount?.toFixed(2)}</td>
                <td className="px-4 py-3">{(fd.interestRate * 100).toFixed(2)}%</td>
                <td className="px-4 py-3">{fd.durationMonths}</td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(fd.maturityDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No fixed deposits yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
