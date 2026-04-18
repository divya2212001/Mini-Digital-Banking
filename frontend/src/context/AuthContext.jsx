import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, setToken, getToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/user/profile");
      const u = data.data;
      setUser({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      });
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.data.token);
    const u = data.data.user;
    setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
    return data.data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setToken(data.data.token);
    const u = data.data.user;
    setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
    return data.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    document.body.classList.remove("theme-light");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser: loadProfile,
    }),
    [user, loading, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
