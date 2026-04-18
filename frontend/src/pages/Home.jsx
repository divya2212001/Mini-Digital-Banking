import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-bank-bg text-bank-text">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.18),transparent)]" />
      <header className="relative border-b border-white/10 bg-bank-bg/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-bank-primary to-teal-300 bg-clip-text text-transparent">
            NeoBank Pro
          </span>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-xl border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-4 py-2 rounded-xl bg-bank-primary text-bank-bg font-semibold hover:bg-teal-400 transition-all shadow-lg shadow-bank-primary/25"
            >
              Open account
            </Link>
          </div>
        </div>
      </header>

      <section className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-bank-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Next-gen digital banking
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-bank-text">
            Premium experience. Production-grade security.
          </h1>
          <p className="text-bank-muted text-lg mb-8 leading-relaxed">
            Glass UI, real-time analytics, AI insights, and fraud-aware operations — powered by a TypeScript
            backend with clean architecture.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-bank-primary text-bank-bg font-semibold hover:bg-teal-400 transition-all shadow-xl shadow-bank-primary/20"
            >
              Get started
            </Link>
            <span className="px-6 py-3 rounded-xl border border-white/10 text-bank-muted text-sm flex items-center">
              NeoBank Pro · Demo
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="glass-panel rounded-3xl p-8 card-hover"
        >
          <h2 className="text-lg font-semibold mb-6 text-bank-text">Why recruiters notice</h2>
          <ul className="space-y-4 text-bank-muted">
            <li className="flex gap-3">
              <Sparkles className="w-5 h-5 shrink-0 text-bank-primary" />
              <span>Framer Motion, Recharts, Lucide — modern React stack</span>
            </li>
            <li className="flex gap-3">
              <Shield className="w-5 h-5 shrink-0 text-bank-primary" />
              <span>JWT, validation, rate limits, OOP domain layer</span>
            </li>
            <li className="flex gap-3">
              <Zap className="w-5 h-5 shrink-0 text-bank-primary" />
              <span>AI insights, goals, FD analytics, glassmorphism UI</span>
            </li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
