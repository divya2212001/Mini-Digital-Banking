import { useSettings } from "../context/SettingsContext";

/**
 * Shared class names for form controls and tables in dark vs light theme.
 */
export function useBankTheme() {
  const { settings } = useSettings();
  const light = settings.theme === "light";

  return {
    light,
    input:
      "w-full rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-bank-primary/40 " +
      (light
        ? "bg-white border border-slate-300 text-black placeholder:text-slate-400"
        : "bg-bank-bg/80 border border-white/10 text-bank-text placeholder:text-bank-muted"),
    select:
      "w-full rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-bank-primary/40 " +
      (light
        ? "bg-white border border-slate-300 text-black"
        : "bg-bank-bg/80 border border-white/10 text-bank-text"),
    tableWrap:
      "overflow-x-auto rounded-xl border " +
      (light ? "border-slate-200 bg-white/80" : "border-slate-800 bg-white/5"),
    thead: light ? "bg-slate-100 text-left text-slate-600" : "bg-slate-900/80 text-left text-slate-400",
    rowBorder: light ? "border-t border-slate-200" : "border-t border-slate-800",
    cellMuted: light ? "text-slate-600" : "text-slate-400",
    pageTitle: light ? "text-slate-900" : "text-bank-text",
    pageSub: light ? "text-slate-600" : "text-bank-muted",
    primaryButton:
      "rounded-xl bg-bank-primary px-6 py-2 font-semibold transition-all shadow-lg " +
      (light ? "text-white hover:bg-teal-600 shadow-bank-primary/20" : "text-bank-bg hover:bg-teal-400"),
    secondaryButton:
      "rounded-xl border px-4 py-2 text-sm transition-colors " +
      (light
        ? "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
        : "border-slate-600 bg-slate-900/50 text-slate-200 hover:bg-slate-800"),
    label:
      "block text-xs uppercase mb-1 font-medium " +
      (light ? "text-slate-700" : "text-slate-500"),
    alertError:
      "rounded-xl px-3 py-2 text-sm " +
      (light ? "border border-red-200 bg-red-50 text-red-800" : "border border-red-500/30 bg-red-500/10 text-red-200"),
    alertSuccess:
      "rounded-xl px-3 py-2 text-sm " +
      (light
        ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"),
    mutedText: light ? "text-slate-600" : "text-slate-500",
    tableCell: light ? "text-slate-800" : "text-inherit",
    balancePositive: light ? "text-teal-700 font-medium" : "text-emerald-300",
  };
}
