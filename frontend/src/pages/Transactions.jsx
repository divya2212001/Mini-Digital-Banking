import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useBankTheme } from "../hooks/useBankTheme";

export default function Transactions() {
  const t = useBankTheme();
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
          <h1 className={`text-2xl font-semibold ${t.pageTitle}`}>Transactions</h1>
          <p className={`text-sm ${t.pageSub}`}>History for the selected account.</p>
        </div>
        <div className="flex gap-2">
          <select
            className={`${t.select} text-sm py-2`}
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountNumber}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => {
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
            }} className={t.secondaryButton}>
            Download PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className={t.mutedText}>Loading…</p>
      ) : (
        <div className={t.tableWrap}>
          <table className="min-w-full text-sm">
            <thead className={t.thead}>
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Suspicious</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className={t.rowBorder}>
                  <td className={`px-4 py-3 ${t.cellMuted}`}>
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 ${t.tableCell}`}>{row.type}</td>
                  <td className={`px-4 py-3 ${t.tableCell}`}>${row.amount?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {row.suspicious ? (
                      <span className="text-amber-500 text-xs font-medium">Yes</span>
                    ) : (
                      <span className={t.mutedText}>—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={4} className={`px-4 py-8 text-center ${t.mutedText}`}>
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
