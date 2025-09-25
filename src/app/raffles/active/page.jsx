"use client";
import { useEffect, useState } from "react";
import { getActiveRaffle } from "../../../services/raffleService";
import styles from '../raffle.module.css'

export default function ActiveRaffle() {
  const [raffle, setRaffle] = useState(null);

  useEffect(() => {
    getActiveRaffle()
      .then(setRaffle)
      .catch(console.error);
  }, []);

  if (!raffle) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <h1>🎟 Sorteio Ativo</h1>
      {raffle.raffle ? (
        <>
          <p><b>Data:</b> {new Date(raffle.raffle.drawDate).toLocaleString("pt-BR")}</p>
          <p><b>Restantes:</b> {raffle.remainingTotalNumbers}</p>
          <p><b>Restantes por usuário:</b> {raffle.remainingUserNumbers}</p>

          {raffle.userNumbers?.length > 0 && (
            <div>
              <h3>Seus números:</h3>
              <ul>
                {raffle.userNumbers.map((n, i) => (
                  <li key={i}>{n.number} ({new Date(n.createdAt).toLocaleString("pt-BR")})</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>Nenhum sorteio ativo.</p>
      )}
    </div>
  );
}