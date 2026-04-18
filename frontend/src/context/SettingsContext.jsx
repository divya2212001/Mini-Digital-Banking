import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme: "dark",
    emailNotifications: true,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/user/settings");
      setSettings(data.data);
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      refresh();
    } else {
      setLoading(false);
    }
  }, [user, refresh]);

  const updateSettings = async (partial) => {
    const { data } = await api.put("/user/settings", partial);
    setSettings(data.data);
    return data.data;
  };

  const value = useMemo(
    () => ({
      settings,
      loading,
      updateSettings,
      refresh,
    }),
    [settings, loading, refresh]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
