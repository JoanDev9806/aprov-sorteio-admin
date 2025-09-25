"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function RafflesList() {
  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    api.get("/raffle")
      .then(res => setRaffles(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📋 Lista de Sorteios</h1>
      {raffles.length === 0 ? (
        <p>Nenhum sorteio encontrado</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data do Sorteio</th>
              <th>Ativo</th>
              <th>Números Máx</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {raffles.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{new Date(r.drawDate).toLocaleString("pt-BR")}</td>
                <td>{r.isActive ? "✅" : "❌"}</td>
                <td>{r.maxRaffleNumbers}</td>
                <td>
                  <button
                    onClick={() =>
                      api.put(`/raffle/${r.id}/set-active?isActive=${!r.isActive}`)
                        .then(() => window.location.reload())
                    }
                  >
                    {r.isActive ? "Desativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}