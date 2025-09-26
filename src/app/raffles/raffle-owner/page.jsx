"use client";
import { useState } from "react";
import { getOwnerByNumber } from "@/services/raffleService";
import styles from "./owner.module.css";

export default function RaffleOwnerPage() {
    const [raffleId, setRaffleId] = useState("");
    const [number, setNumber] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        try {
            setError("");
            setData(null);
            const result = await getOwnerByNumber(raffleId, number);
            setData(result);
        } catch (err) {
            setError(err.message); // aqui já vem "Número não encontrado nesse sorteio"
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
                <h1>🔎 Buscar Dono do Número</h1>

                <input
                    type="text"
                    placeholder="ID do Sorteio (raffleId)"
                    value={raffleId}
                    onChange={(e) => setRaffleId(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Número da sorte (ex: 62)"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />

                <button onClick={handleSearch}>Buscar</button>

                {error && <p className={styles.error}>{error}</p>}

                {data && (
                    <div className={styles.resultBox}>
                        <h2>🎉 Usuário encontrado</h2>
                        <p><strong>Nome:</strong> {data.name}</p>
                        <p><strong>Email:</strong> {data.email}</p>
                        <p><strong>Telefone:</strong> {data.phone}</p>
                        <p><strong>CPF:</strong> {data.cpf}</p>
                        <p><strong >UID:</strong> <a style={{ cursor: "pointer", color: "#0070f3", textDecoration: "underline" }}
                            onClick={() => navigator.clipboard.writeText(data.uid)}
                            title="Clique para copiar o ID">{data.uid}</a></p>

                        <h3>Números desse usuário</h3>
                        <ul>
                            {data.numbers.map((n, idx) => (
                                <li key={idx}>
                                    {n.number} - {new Date(n.createdAt).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}