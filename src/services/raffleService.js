import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7067/api", // sua API backend
});

export const getActiveRaffle = async () => {
  const res = await api.get(`/raffle/active-raffle`);
  return res.data;
};

// criar sorteio
export async function createRaffle(data) {
  const res = await fetch("https://localhost:7067/api/raffle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}


// listar todos (precisa implementar no backend GET /raffle/all)
export const getAllRaffles = async () => {
  const res = await api.get("/raffle/all");
  return res.data;
};

// ativar/desativar
export const setActiveRaffle = async (raffleId, isActive) => {
  const res = await api.put(`/raffle/${raffleId}/set-active?isActive=${isActive}`);
  return res.data;
};