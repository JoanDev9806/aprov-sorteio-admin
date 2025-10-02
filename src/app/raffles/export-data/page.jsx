"use client";
import { useState } from "react";
import api from "@/services/api";
import styles from "./export.module.css";

export default function ExportarCsvPage() {
  const [raffleId, setRaffleId] = useState("");
  const [competencia, setCompetencia] = useState("");
  const [serie, setSerie] = useState("0001");
  const [dataSorteio, setDataSorteio] = useState("");
  const [valorTitulo, setValorTitulo] = useState("10.00");
  const [remessaSequencial, setRemessaSequencial] = useState("1");
  const [seqArquivo, setSeqArquivo] = useState("0001");


  const handleExport = async () => {
    if (!raffleId || !competencia || !dataSorteio) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    try {
      // converter antes de mandar
      const dataReq = dataSorteio.replace(/-/g, ""); // yyyyMMdd

      const url = `/raffle/${raffleId}/export-capemisa?competencia=${competencia}&serie=${serie}&dataSorteio=${dataReq}&valorTitulo=${valorTitulo}&remessaSequencial=${remessaSequencial}&seqArquivo=${seqArquivo}`;

      const res = await api.get(url, { responseType: "blob" });

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      let fileName = "export.csv";
      const dispo = res.headers["content-disposition"];
      if (dispo) {
        const match = dispo.match(/filename="?([^"]+)"?/);
        if (match?.[1]) fileName = match[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar CSV");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }} className={styles.container}>
      <h1>📤 Exportar CSV</h1>

      <label>Sorteio (RaffleId)</label>
      <input value={raffleId} onChange={e => setRaffleId(e.target.value)} placeholder="ID do sorteio" />

      <label>Competência (yyyyMM)</label>
      <input value={competencia} onChange={e => setCompetencia(e.target.value)} placeholder="202510" />

      <label>Série</label>
      <input value={serie} onChange={e => setSerie(e.target.value)} />

      <label>Data do Sorteio</label>
      <input
        type="date"
        value={dataSorteio}
        onChange={e => setDataSorteio(e.target.value)} // mantém yyyy-MM-dd
      />

      <label>Valor do Título</label>
      <input type="number" step="0.01" value={valorTitulo} onChange={e => setValorTitulo(e.target.value)} />

      <label>Remessa Sequencial</label>
      <input type="number" value={remessaSequencial} onChange={e => setRemessaSequencial(e.target.value)} />

      <label>Sequência Arquivo</label>
      <input value={seqArquivo} onChange={e => setSeqArquivo(e.target.value)} />

      <button style={{ marginTop: 20 }} className={styles.button} onClick={handleExport}>
        📥 Gerar CSV
      </button>
    </div>
  );
}