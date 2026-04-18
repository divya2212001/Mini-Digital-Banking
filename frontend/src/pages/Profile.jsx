import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";
import { ShieldCheck, Smartphone, Building2, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const light = settings.theme === "light";
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    api.get("/accounts/my").then((res) => setAccounts(res.data.data || [])).catch(() => {});
  }, []);

  const primaryAcc = accounts.find((a) => a.type === "SAVINGS") || accounts[0];
  const upiId = user?.email
    ? `${user.email.split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 12) || "user"}@neobank.upi`
    : "—";

  const panel = light ? "glass-panel-light rounded-2xl p-6 card-hover" : "glass-panel rounded-2xl p-6 card-hover";
  const label = light ? "text-xs font-semibold uppercase tracking-wider text-slate-500" : "text-xs font-semibold uppercase tracking-wider text-bank-muted";
  const value = light ? "text-lg font-medium text-slate-900" : "text-lg font-medium text-bank-text";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold tracking-tight ${light ? "text-slate-900" : "text-bank-text"}`}>
          Profile & KYC
        </h1>
        <p className={`mt-1 ${light ? "text-slate-600" : "text-bank-muted"}`}>
          Identity, linked accounts, and security.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={panel}>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-bank-primary" />
            <h2 className={`text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>KYC status</h2>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <span className="text-sm font-medium text-bank-primary">Verified</span>
            <span className={`text-xs ${light ? "text-slate-600" : "text-bank-muted"}`}>
              Completed on {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </span>
          </div>
          <p className={`mt-3 text-sm ${light ? "text-slate-600" : "text-bank-muted"}`}>
            Demo: KYC is simulated as verified for all registered customers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={panel}
        >
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-bank-primary" />
            <h2 className={`text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
              Primary account
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className={label}>Account number</p>
              <p className={`${value} font-mono text-base`}>{primaryAcc?.accountNumber ?? "—"}</p>
            </div>
            <div>
              <p className={label}>Account type</p>
              <p className={value}>{primaryAcc?.type ?? "Open an account in Wallet"}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={panel}
        >
          <div className="mb-4 flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-bank-primary" />
            <h2 className={`text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>UPI</h2>
          </div>
          <p className={label}>UPI ID</p>
          <p className={`${value} font-mono text-base break-all`}>{upiId}</p>
          <p className={`mt-2 text-sm ${light ? "text-slate-600" : "text-bank-muted"}`}>
            Virtual UPI for demo payouts and requests.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={panel}
        >
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6 text-bank-primary" />
            <h2 className={`text-lg font-semibold ${light ? "text-slate-900" : "text-bank-text"}`}>
              Security
            </h2>
          </div>
          <ul className={`space-y-2 text-sm ${light ? "text-slate-700" : "text-bank-muted"}`}>
            <li>• JWT sessions with secure password hashing</li>
            <li>• Transaction alerts (simulated email log)</li>
            <li>• Fraud flags on unusual amounts</li>
          </ul>
          <Link
            to="/settings"
            className="mt-4 inline-flex text-sm font-medium text-bank-primary hover:underline"
          >
            Open security & settings →
          </Link>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={panel}>
        <p className={label}>Full name</p>
        <p className={value}>{user?.name}</p>
        <p className={`${label} mt-4`}>Email</p>
        <p className={value}>{user?.email}</p>
      </motion.div>
    </div>
  );
}
