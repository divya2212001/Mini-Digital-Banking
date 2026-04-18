import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-bank-primary/50";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from && from !== "/login" ? from : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bank-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(20,184,166,0.12),transparent)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl card-hover"
      >
        <p className="text-center text-sm font-bold text-bank-primary mb-6">NeoBank Pro</p>
        <h1 className="text-2xl font-semibold text-black mb-2">Welcome back</h1>
        <p className="text-sm text-slate-600 mb-6">Sign in to continue</p>
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-black font-medium mb-1">Email</label>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-black font-medium mb-1">Password</label>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-bank-primary py-2.5 font-semibold text-white hover:bg-teal-600 disabled:opacity-60 transition-all shadow-lg shadow-bank-primary/25"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-black">
          No account?{" "}
          <Link to="/register" className="text-bank-primary font-semibold hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
