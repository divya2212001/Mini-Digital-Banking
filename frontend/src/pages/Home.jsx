import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 backdrop-blur bg-slate-950/70 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight text-emerald-400">MiniBank</span>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400"
            >
              Open account
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">
            Mini Digital Banking
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Banking operations with a production-grade TypeScript backend.
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Savings accounts, transfers, fixed deposits, analytics, and fraud-aware transaction
            flags — built with clean architecture and OOP patterns.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400"
            >
              Get started
            </Link>
            <span className="px-6 py-3 rounded-xl border border-slate-700 text-slate-500 cursor-default">
              See README.md in the project root
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl shadow-emerald-500/5">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">Highlights</h2>
          <ul className="space-y-3 text-slate-400">
            <li>JWT auth, protected routes, validation, rate limiting</li>
            <li>Repository + service layers, factories, singleton DB</li>
            <li>Fraud flags on high-value transactions</li>
            <li>PDF statements &amp; simulated email logs</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
