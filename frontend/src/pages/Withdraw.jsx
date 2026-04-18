import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Withdraw() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/accounts/my")
      .then((res) => {
        const list = res.data.data.filter((a) => a.type === "SAVINGS");
        setAccounts(list);
        if (list[0]) setAccountId(list[0].id);
      })
      .catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await api.post("/transactions/withdraw", {
        accountId,
        amount: Number(amount),
      });
      setMsg("Withdrawal completed.");
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Withdraw</h1>
      <p className="text-slate-500 mb-8">Withdraw from a savings account.</p>
      <form onSubmit={submit} className="max-w-md space-y-4">
        <div>
          <label className="block text-xs uppercase text-slate-500 mb-1">Account</label>
          <select
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountNumber} — ${a.balance?.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
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
          Withdraw
        </button>
      </form>
    </div>
  );
}
