import axios from "axios";

const api = axios.create({
  baseURL: "https://aprov-creditcard.azurewebsites.net/api",
});

// injeta token em toda request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const t = localStorage.getItem("admin_jwt");
    if (t) config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

// trata 401/403 globalmente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined") {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("admin_jwt");
        // opcional: feedback amigável
        // alert("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;