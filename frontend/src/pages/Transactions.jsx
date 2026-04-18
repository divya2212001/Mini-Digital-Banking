import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/accounts/my").then((res) => {
      setAccounts(res.data.data);
      if (res.data.data[0]) setAccountId(res.data.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    api
      .get(`/transactions/history/${accountId}`)
      .then((res) => setRows(res.data.data))
      .finally(() => setLoading(false));
  }, [accountId]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-slate-500 text-sm">History for the selected account.</p>
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountNumber}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const token = localStorage.getItem("token");
              const url = `${api.defaults.baseURL}/transactions/history/${accountId}/export-pdf`;
              fetch(url, { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.blob())
                .then((blob) => {
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = `statement-${accountId}.pdf`;
                  a.click();
                });
            }}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Download PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Suspicious</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t._id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{t.type}</td>
                  <td className="px-4 py-3">${t.amount?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {t.suspicious ? (
                      <span className="text-amber-400 text-xs">Yes</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No transactions yet.
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
