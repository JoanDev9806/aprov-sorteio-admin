import api from "./api";

const STORAGE_KEY = "admin_jwt";

export function setAdminToken(token) {
  localStorage.setItem(STORAGE_KEY, token);
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(STORAGE_KEY);
  delete api.defaults.headers["Authorization"];
}

export function isAdminLogged() {
  const t = getAdminToken();
  return !!t && t.length > 0;
}

export async function adminLogin({ username, password }) {
  // sua API: POST /api/admin/login
  const res = await api.post("/admin/login", { username, password });
  // resposta esperada:
  // { success: true, token: "...", expiresAt: "..." }
  return res.data;
}