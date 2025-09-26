"use client";
import { useState } from "react";
import { createWinner } from "@/services/raffleService";
import styles from "../raffle.module.css";

export default function WinnerPage() {
    const [userUid, setUserUid] = useState("");
    const [raffleId, setRaffleId] = useState("");
    const [drawnNumber, setDrawnNumber] = useState("");
    const [winner, setWinner] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            setError("");
            setWinner(null);

            const body = {
                userUid,
                raffleId,
                drawnNumber,
            };

            const res = await createWinner(body);
            if (!res.success) {
                setError(res.message);
                return;
            }
            setWinner(res.winner);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{
            margin: "40px 0",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
        }}>
            <div className={styles.container}>
                <div className={styles.create}>

                    <h1>🏆 Definir Vencedor</h1>

                    <input
                        placeholder="User UID"
                        value={userUid}
                        onChange={(e) => setUserUid(e.target.value)}
                    />
                    <input
                        placeholder="Raffle ID"
                        value={raffleId}
                        onChange={(e) => setRaffleId(e.target.value)}
                    />
                    <input
                        placeholder="Número sorteado"
                        value={drawnNumber}
                        onChange={(e) => setDrawnNumber(e.target.value)}
                    />

                    <button className={styles.button} onClick={handleSubmit}>Definir Vencedor</button>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {winner && (
                        <div className={styles.card}>
                            <h3>🎉 Vencedor Criado</h3>
                            <p><b>Nome:</b> {winner.name}</p>
                            <p><b>Email:</b> {winner.email}</p>
                            <p><b>CPF:</b> {winner.cpf}</p>
                            <p><b>Número Sorteado:</b> {winner.drawnNumber}</p>
                            <p><b>Valor:</b> R$ {winner.value}</p>
                            <p><b>Data:</b> {new Date(winner.drawnDate).toLocaleString("pt-BR")}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}