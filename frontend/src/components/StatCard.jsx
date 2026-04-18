import React from "react";
import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  delay = 0,
  light,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`rounded-2xl p-5 card-hover ${
        light
          ? "glass-panel-light border border-slate-200/80"
          : "glass-panel"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-xs font-medium uppercase tracking-wider ${
              light ? "text-slate-500" : "text-bank-muted"
            }`}
          >
            {title}
          </p>
          <p
            className={`mt-2 text-2xl font-semibold tracking-tight ${
              light ? "text-slate-900" : "text-bank-text"
            }`}
          >
            {value}
          </p>
          {sub && (
            <p className={`mt-1 text-sm ${light ? "text-slate-600" : "text-bank-muted"}`}>{sub}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`rounded-xl p-2.5 ${
              light ? "bg-teal-100 text-teal-700" : "bg-bank-primary/15 text-bank-primary"
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
