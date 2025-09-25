"use client";
import { useState } from "react";
import { createRaffle } from "@/services/raffleService";
import styles from '../raffle.module.css'

export default function CreateRaffle() {
  const [value, setValue] = useState("");
  const [drawDate, setDrawDate] = useState("");
  const [maxTotal, setMaxTotal] = useState(100);
  const [maxUser, setMaxUser] = useState(5);

 const handleCreate = async () => {
  try {
    const dateObj = new Date(drawDate);
    const formattedDate = dateObj.toLocaleDateString("pt-BR"); // gera dd/MM/yyyy

    const body = {
      value: parseFloat(value),
      drawDate: formattedDate, // já no padrão esperado pelo backend
      isActive: true,
      maxRaffleNumbers: parseInt(maxTotal),
      maxUserRaffleNumbers: parseInt(maxUser),
    };

    await createRaffle(body);
    alert("✅ Sorteio criado!");
  } catch (err) {
    console.error(err);
    alert("Erro ao criar sorteio");
  }
};

  return (
    <div className={styles.container}>
      <h1>➕ Criar Sorteio</h1>
      <input placeholder="Valor" value={value} onChange={e => setValue(e.target.value)} />
      <input placeholder="Data (dd/MM/yyyy)" type="date" value={drawDate} onChange={e => setDrawDate(e.target.value)} />
      <input placeholder="Máx. números" type="number" value={maxTotal} onChange={e => setMaxTotal(e.target.value)} />
      <input placeholder="Máx. por usuário" type="number" value={maxUser} onChange={e => setMaxUser(e.target.value)} />
      <button onClick={handleCreate}>Criar</button>
    </div>
  );
}