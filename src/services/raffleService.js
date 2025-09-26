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

export async function getOwnerByNumber(raffleId, numberValue) {
  try {
    const res = await api.get(`/raffle/${raffleId}/number/${numberValue}/owner`, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    if (err.response) {
      // Se for 404 do backend
      if (err.response.status === 404) {
        throw new Error(err.response.data.message || "Número não encontrado nesse sorteio");
      }
      // Outros erros controlados
      throw new Error(err.response.data.message || "Erro ao buscar dono do número");
    }

    // Caso erro genérico (rede, etc.)
    throw new Error("Erro inesperado, tente novamente.");
  }
  
}


export async function createWinner(body) {
  try {
    const res = await api.post("/winner", body, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message || "Erro ao criar vencedor");
    }
    throw new Error("Erro inesperado");
  }
}


export async function updateRaffle(body) {
  const res = await api.put(`/raffle`, body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}