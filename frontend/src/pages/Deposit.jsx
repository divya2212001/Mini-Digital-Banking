import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useBankTheme } from "../hooks/useBankTheme";

export default function Deposit() {
  const t = useBankTheme();
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
      await api.post("/transactions/deposit", {
        accountId,
        amount: Number(amount),
      });
      setMsg("Deposit completed.");
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Deposit failed");
    }
  }

  return (
    <div>
      <h1 className={`text-2xl font-semibold mb-2 ${t.pageTitle}`}>Deposit</h1>
      <p className={`${t.pageSub} mb-8`}>Add funds to a savings account.</p>
      <form onSubmit={submit} className="max-w-md space-y-4">
        <div>
          <label className={t.label}>Account</label>
          <select className={t.select} value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountNumber} — ${a.balance?.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
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
        {error && <div className={t.alertError}>{error}</div>}
        {msg && <div className={t.alertSuccess}>{msg}</div>}
        <button type="submit" className={t.primaryButton}>
          Deposit
        </button>
      </form>
    </div>
  );
}
