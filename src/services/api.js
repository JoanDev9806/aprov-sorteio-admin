import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7067/api",
});

export default api;