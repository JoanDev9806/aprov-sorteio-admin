import api from "./api";

export const getActiveRaffle = async () => {
  const res = await api.get("/raffle/active-raffle");
  return res.data;
};

export async function createRaffle(data) {
  const res = await api.post("/raffle", data);
  return res.data;
}

export const getAllRaffles = async () => {
  const res = await api.get("/raffle/all");
  return res.data;
};

export const setActiveRaffle = async (raffleId, isActive) => {
  const res = await api.put(`/raffle/${raffleId}/set-active`, null, {
    params: { isActive },
  });
  return res.data;
};

export async function getOwnerByNumber(raffleId, numberValue) {
  try {
    const res = await api.get(`/raffle/${raffleId}/number/${numberValue}/owner`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error(err.response.data?.message || "Número não encontrado nesse sorteio");
    }
    throw new Error(err.response?.data?.message || "Erro ao buscar dono do número");
  }
}

export async function createWinner(body) {
  try {
    const res = await api.post("/winner", body);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao criar vencedor");
  }
}

export async function updateRaffle(body) {
  const res = await api.put("/raffle", body);
  return res.data;
}