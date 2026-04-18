import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const isLight = settings.theme === "light";
  const section = isLight ? "glass-panel-light rounded-2xl p-6 card-hover" : "glass-panel rounded-2xl p-6 card-hover";

  async function toggleTheme() {
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      await updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
      setMsg("Appearance saved.");
    } catch (e) {
      setErr(e.response?.data?.message || "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEmail() {
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      await updateSettings({ emailNotifications: !settings.emailNotifications });
      setMsg("Notification preference saved.");
    } catch (e) {
      setErr(e.response?.data?.message || "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function submitPassword(e) {
    e.preventDefault();
    setPwdErr("");
    setPwdMsg("");
    setPwdLoading(true);
    try {
      await api.put("/user/password", {
        currentPassword,
        newPassword,
      });
      setPwdMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      setPwdErr(e.response?.data?.message || "Could not update password");
    } finally {
      setPwdLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-bank-text"}`}>
          Settings
        </h1>
        <p className={`mt-1 ${isLight ? "text-slate-600" : "text-bank-muted"}`}>
          Appearance, notifications, and security.
        </p>
      </motion.div>

      {err && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-xl border border-bank-primary/30 bg-bank-primary/10 px-4 py-3 text-sm text-bank-primary">
          {msg}
        </div>
      )}

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={section}>
        <h2 className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-900" : "text-bank-text"}`}>
          Appearance
        </h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`font-medium ${isLight ? "text-slate-800" : "text-bank-text"}`}>Theme</p>
            <p className={`text-sm ${isLight ? "text-slate-600" : "text-bank-muted"}`}>
              Synced with the navbar toggle.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={toggleTheme}
            className="shrink-0 rounded-xl bg-bank-primary px-4 py-2 text-sm font-semibold text-bank-bg hover:bg-teal-400 disabled:opacity-50 transition-all shadow-lg shadow-bank-primary/20"
          >
            {settings.theme === "dark" ? "Switch to light" : "Switch to dark"}
          </button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={section}
      >
        <h2 className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-900" : "text-bank-text"}`}>
          Notifications
        </h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`font-medium ${isLight ? "text-slate-800" : "text-bank-text"}`}>Email alerts</p>
            <p className={`text-sm ${isLight ? "text-slate-600" : "text-bank-muted"}`}>
              Simulated transaction emails when enabled.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={toggleEmail}
            className={`relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors ${
              settings.emailNotifications ? "bg-bank-primary" : isLight ? "bg-slate-300" : "bg-white/20"
            }`}
            aria-pressed={settings.emailNotifications}
          >
            <span
              className={`inline-block h-6 w-6 translate-y-1 rounded-full bg-white shadow transition ${
                settings.emailNotifications ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={section}
      >
        <h2 className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-900" : "text-bank-text"}`}>
          Security
        </h2>
        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label className={`block text-xs uppercase mb-1 ${isLight ? "text-slate-500" : "text-bank-muted"}`}>
              Current password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className={`w-full rounded-xl border px-3 py-2.5 ${
                isLight
                  ? "border-slate-300 bg-white text-slate-900"
                  : "border-white/10 bg-bank-bg/80 text-bank-text"
              }`}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className={`block text-xs uppercase mb-1 ${isLight ? "text-slate-500" : "text-bank-muted"}`}>
              New password (min 8)
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={`w-full rounded-xl border px-3 py-2.5 ${
                isLight
                  ? "border-slate-300 bg-white text-slate-900"
                  : "border-white/10 bg-bank-bg/80 text-bank-text"
              }`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
            />
          </div>
          {pwdErr && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {pwdErr}
            </div>
          )}
          {pwdMsg && (
            <div className="rounded-xl border border-bank-primary/30 bg-bank-primary/10 px-3 py-2 text-sm text-bank-primary">
              {pwdMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={pwdLoading || !currentPassword || newPassword.length < 8}
            className="rounded-xl bg-bank-primary px-5 py-2.5 text-sm font-semibold text-bank-bg hover:bg-teal-400 disabled:opacity-50"
          >
            {pwdLoading ? "Updating…" : "Update password"}
          </button>
        </form>
      </motion.section>
    </div>
  );
}
