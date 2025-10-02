import axios from "axios";

const api = axios.create({
  baseURL: "https://aprov-creditcard.azurewebsites.net/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const t = localStorage.getItem("admin_jwt");
    if (t) config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined") {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("admin_jwt");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;