import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import DebitCard from "../components/DebitCard";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

export default function Cards() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const light = settings.theme === "light";
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    api.get("/accounts/my").then((res) => setAccounts(res.data.data || []));
  }, []);

  const panel = light ? "glass-panel-light rounded-2xl p-6" : "glass-panel rounded-2xl p-6";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold tracking-tight ${light ? "text-slate-900" : "text-bank-text"}`}>
          Cards
        </h1>
        <p className={`mt-1 ${light ? "text-slate-600" : "text-bank-muted"}`}>
          Virtual debit cards linked to your accounts.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {accounts.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <DebitCard
              holderName={user?.name}
              accountNumber={a.accountNumber}
              balance={a.balance}
              network="VISA"
              light={light}
            />
            <p className={`mt-3 text-sm ${light ? "text-slate-600" : "text-bank-muted"}`}>
              {a.type} · {a.status}
            </p>
          </motion.div>
        ))}
        {accounts.length === 0 && (
          <div className={panel}>
            <p className={light ? "text-slate-600" : "text-bank-muted"}>
              Open a savings account from Wallet to issue your first card.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
