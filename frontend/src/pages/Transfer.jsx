import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useBankTheme } from "../hooks/useBankTheme";

export default function Transfer() {
  const t = useBankTheme();
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
      <h1 className={`text-2xl font-semibold mb-2 ${t.pageTitle}`}>Transfer</h1>
      <p className={`${t.pageSub} mb-8`}>Send money to another account by account number.</p>
      <form onSubmit={submit} className="max-w-md space-y-4">
        <div>
          <label className={t.label}>From</label>
          <select
            className={t.select}
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
          <label className={t.label}>To account number</label>
          <input
            className={`${t.input} font-mono`}
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            required
          />
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
          Transfer
        </button>
      </form>
    </div>
  );
}
