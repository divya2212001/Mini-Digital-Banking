import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "http://localhost:5001/api");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
