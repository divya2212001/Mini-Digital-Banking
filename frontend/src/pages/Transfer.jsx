import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/accounts/my")
      .then((res) => {
        const list = res.data.data.filter((a) => a.type === "SAVINGS");
        setAccounts(list);
        if (list[0]) setFromAccountId(list[0].id);
      })
      .catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await api.post("/transactions/transfer", {
        fromAccountId,
        toAccountNumber: toAccountNumber.trim(),
        amount: Number(amount),
      });
      setMsg("Transfer completed.");
      setAmount("");
      setToAccountNumber("");
    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Transfer</h1>
      <p className="text-slate-500 mb-8">Send money to another account by account number.</p>
      <form onSubmit={submit} className="max-w-md space-y-4">
        <div>
          <label className="block text-xs uppercase text-slate-500 mb-1">From</label>
          <select
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountNumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase text-slate-500 mb-1">To account number</label>
          <input
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 font-mono"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            required
          />
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
          Transfer
        </button>
      </form>
    </div>
  );
}
