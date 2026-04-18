import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Accounts() {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">My Accounts</h1>
          <p className="text-slate-500 text-sm">Savings and fixed deposit accounts.</p>
        </div>
        <button
          type="button"
          onClick={createAccount}
          disabled={creating}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {creating ? "Creating…" : "New savings account"}
        </button>
      </div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Account #</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 font-mono text-xs">{a.accountNumber}</td>
                  <td className="px-4 py-3">{a.type}</td>
                  <td className="px-4 py-3 text-emerald-300">${a.balance?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        a.status === "ACTIVE"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!accounts.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
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
