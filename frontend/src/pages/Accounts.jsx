import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useBankTheme } from "../hooks/useBankTheme";

export default function Accounts() {
  const t = useBankTheme();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/accounts/my");
      setAccounts(data.data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createAccount() {
    setCreating(true);
    setError("");
    try {
      await api.post("/accounts/create");
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not create account");
    } finally {
      setCreating(false);
    }
  }

  const badgeActive = t.light
    ? "bg-emerald-100 text-emerald-800"
    : "bg-emerald-500/15 text-emerald-300";
  const badgeFrozen = t.light ? "bg-rose-100 text-rose-800" : "bg-rose-500/15 text-rose-300";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-semibold ${t.pageTitle}`}>My Accounts</h1>
          <p className={`text-sm ${t.pageSub}`}>Savings and fixed deposit accounts.</p>
        </div>
        <button
          type="button"
          onClick={createAccount}
          disabled={creating}
          className={`${t.primaryButton} px-4 py-2 text-sm`}
        >
          {creating ? "Creating…" : "New savings account"}
        </button>
      </div>
      {error && <div className={`mb-4 ${t.alertError}`}>{error}</div>}
      {loading ? (
        <p className={t.mutedText}>Loading…</p>
      ) : (
        <div className={t.tableWrap}>
          <table className="min-w-full text-sm">
            <thead className={t.thead}>
              <tr>
                <th className="px-4 py-3 font-medium">Account #</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className={t.rowBorder}>
                  <td className={`px-4 py-3 font-mono text-xs ${t.tableCell}`}>{a.accountNumber}</td>
                  <td className={`px-4 py-3 ${t.tableCell}`}>{a.type}</td>
                  <td className={`px-4 py-3 ${t.balancePositive}`}>${a.balance?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        a.status === "ACTIVE" ? badgeActive : badgeFrozen
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!accounts.length && (
                <tr>
                  <td colSpan={4} className={`px-4 py-8 text-center ${t.mutedText}`}>
                    No accounts yet. Create a savings account to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
