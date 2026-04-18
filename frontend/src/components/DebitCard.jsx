import React from "react";
import { motion } from "framer-motion";

function maskNumber(num) {
  const s = String(num || "").replace(/\s/g, "");
  if (s.length <= 4) return "•••• •••• •••• " + s;
  return `•••• •••• •••• ${s.slice(-4)}`;
}

export default function DebitCard({
  holderName,
  accountNumber,
  balance,
  network = "VISA",
  light,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl p-6 min-h-[200px] max-w-md shadow-2xl ${
        light
          ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#020617] border border-white/10"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-bank-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-bank-primary/10 blur-2xl" />
      <div className="relative flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <span className="text-xs font-medium tracking-[0.2em] text-white/70">{network} DEBIT</span>
          <span className="text-lg font-bold italic text-bank-primary">{network}</span>
        </div>
        <p className="font-mono text-lg tracking-widest text-white/90">{maskNumber(accountNumber)}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Card holder</p>
            <p className="font-medium text-white">{holderName || "Member"}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-white/50">Balance</p>
            <p className="text-lg font-semibold text-bank-primary tabular-nums">
              {typeof balance === "number"
                ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
                    balance
                  )
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
