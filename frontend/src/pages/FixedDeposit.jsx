import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useBankTheme } from "../hooks/useBankTheme";

const TERMS = [6, 12, 24];

export default function FixedDeposit() {
  const t = useBankTheme();
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
      <h1 className={`text-2xl font-semibold mb-2 ${t.pageTitle}`}>Fixed Deposit</h1>
      <p className={`${t.pageSub} mb-8`}>Lock funds for 6, 12, or 24 months at quoted rates.</p>

      <form onSubmit={submit} className="max-w-md space-y-4 mb-12">
        <div>
          <label className={t.label}>Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={t.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={t.label}>Term (months)</label>
          <select
            className={t.select}
            value={durationMonths}
            onChange={(e) => setDurationMonths(Number(e.target.value))}
          >
            {TERMS.map((m) => (
              <option key={m} value={m}>
                {m} months
              </option>
            ))}
          </select>
        </div>
        {error && <div className={t.alertError}>{error}</div>}
        {msg && <div className={t.alertSuccess}>{msg}</div>}
        <button type="submit" className={t.primaryButton}>
          Create FD
        </button>
      </form>

      <h2 className={`text-lg font-medium mb-4 ${t.pageTitle}`}>Your fixed deposits</h2>
      <div className={t.tableWrap}>
        <table className="min-w-full text-sm">
          <thead className={t.thead}>
            <tr>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">Months</th>
              <th className="px-4 py-3">Maturity</th>
            </tr>
          </thead>
          <tbody>
            {list.map((fd) => (
              <tr key={fd._id} className={t.rowBorder}>
                <td className={`px-4 py-3 ${t.tableCell}`}>${fd.amount?.toFixed(2)}</td>
                <td className={`px-4 py-3 ${t.tableCell}`}>{(fd.interestRate * 100).toFixed(2)}%</td>
                <td className={`px-4 py-3 ${t.tableCell}`}>{fd.durationMonths}</td>
                <td className={`px-4 py-3 ${t.cellMuted}`}>
                  {new Date(fd.maturityDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={4} className={`px-4 py-8 text-center ${t.mutedText}`}>
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
