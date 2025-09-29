"use client";
import { useEffect, useState } from "react";
import { getAllRaffles, getActiveRaffle, updateRaffle } from "@/services/raffleService";
import api from "@/services/api";
import styles from "./raffle.module.css";
import RequireAdmin from "@/components/RequireAdmin/RequireAdmin";

function toBR(dateIsoOrJsDate) {
  const d = new Date(dateIsoOrJsDate);
  return d.toLocaleString("pt-BR");
}
function toInputDate(dateIsoOrJsDate) {
  const d = new Date(dateIsoOrJsDate);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function ymdToBr(ymd) {
  if (!ymd) return "";
  const [yyyy, mm, dd] = ymd.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export default function RafflesList() {
  const [raffle, setRaffle] = useState(null);
  const [raffles, setRaffles] = useState([]);

  const [showEditor, setShowEditor] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editMaxTotal, setEditMaxTotal] = useState(0);
  const [editMaxPerUser, setEditMaxPerUser] = useState(0);
  const [editActive, setEditActive] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllRaffles().then(setRaffles).catch(console.error);
  }, []);

  useEffect(() => {
    getActiveRaffle()
      .then(res => {
        setRaffle(res);
        if (res?.raffle) {
          setEditValue(res.raffle.value);
          setEditDate(toInputDate(res.raffle.drawDate));
          setEditActive(res.raffle.isActive);
          setEditMaxTotal(res.raffle.maxRaffleNumbers)
          setEditMaxPerUser(res.raffle.maxUserRaffleNumbers);
        }
      })
      .catch(console.error);
  }, []);

  const handleToggleEditor = () => setShowEditor(v => !v);

  const handleSave = async () => {
    if (!raffle?.raffle) return;

    const valueNum = parseFloat(editValue);
    const maxTotalNum = parseInt(editMaxTotal, 10);
    const maxPerUserNum = parseInt(editMaxPerUser, 10);

    if (!(valueNum > 0)) return alert("Valor do prêmio deve ser maior que zero.");
    if (!(maxTotalNum > 0)) return alert("Máximo de números do sorteio deve ser > 0.");
    if (!(maxPerUserNum > 0)) return alert("Máximo por usuário deve ser > 0.");
    try {
      setSaving(true);
      await updateRaffle({
        id: raffle.raffle.id,
        value: parseFloat(editValue),
        drawDate: ymdToBr(editDate),
        maxRaffleNumbers: maxTotalNum,
        maxUserRaffleNumbers: maxPerUserNum,
        isActive: !!editActive,
      });
      alert("✅ Sorteio atualizado!");
      const updated = await getActiveRaffle();
      setRaffle(updated);
      setShowEditor(false);
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar sorteio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireAdmin>
      <div
        style={{
          margin: "40px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        {raffle && (
          <div className={styles.container}>
            <div className={styles.headerLine}>
              <h1>🎟 Sorteio Ativo</h1>
              {raffle.raffle && (
                <button
                  className={styles.iconButton}
                  onClick={handleToggleEditor}
                  title={showEditor ? "Fechar edição" : "Editar sorteio"}
                >
                  ✏️
                </button>
              )}
            </div>

            {raffle.raffle ? (
              <>
                <p>
                  <b>Data do sorteio:</b> {toBR(raffle.raffle.drawDate)}
                </p>
                <p>
                  <b>Restantes:</b> {raffle.remainingTotalNumbers}
                </p>
                <p>
                  <b>Ativo:</b> {raffle.raffle.isActive ? "sim" : "não"}
                </p>
                <p>
                  <b>Números por participante:</b> {raffle.raffle.maxUserRaffleNumbers}
                </p>
                <p>
                  <b>Prêmio R$:</b> {raffle.raffle.value}
                </p>
                {showEditor && (
                  <div className={styles.editBlock}>
                    <h3>Editar sorteio</h3>

                    <label>💰 Valor do prêmio</label>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />

                    <label>📅 Data do sorteio</label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                    <label>🔢 Máx. de números do sorteio</label>
                    <input
                      type="number"
                      min={1}
                      value={editMaxTotal}
                      onChange={(e) => setEditMaxTotal(e.target.value)}
                    />

                    <label>👤 Máx. de números por usuário</label>
                    <input
                      type="number"
                      min={1}
                      value={editMaxPerUser}
                      onChange={(e) => setEditMaxPerUser(e.target.value)}
                    />
                    <label className={styles.checkboxLine}>
                      <input
                        type="checkbox"
                        checked={editActive}
                        onChange={(e) => setEditActive(e.target.checked)}
                      />
                      Ativo
                    </label>

                    <div className={styles.actionsRow}>
                      <button className={styles.save_button} disabled={saving} onClick={handleSave}>
                        {saving ? "Salvando..." : "💾 Salvar"}
                      </button>
                      <button className={styles.ghost} onClick={() => setShowEditor(false)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {raffle.userNumbers?.length > 0 && (
                  <div>
                    <h3>Seus números:</h3>
                    <ul>
                      {raffle.userNumbers.map((n, i) => (
                        <li key={i}>
                          {n.number} ({toBR(n.createdAt)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p>Nenhum sorteio ativo.</p>
            )}
          </div>
        )}

        <div className={styles.container}>
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
                {raffles.map((r) => {
                  const drawDateWithMargin = new Date(r.drawDate);
                  drawDateWithMargin.setDate(drawDateWithMargin.getDate() + 2);
                  const isExpired = new Date() > drawDateWithMargin;
                  const isActiveRaffle = raffle?.raffle?.id === r.id;
                  const hasActiveRaffle = raffle?.raffle !== null;

                  return (
                    <tr key={r.id}>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "#0070f3",
                          textDecoration: "underline",
                        }}
                        onClick={() => navigator.clipboard.writeText(r.id)}
                        title="Clique para copiar o ID"
                      >
                        {r.id}
                      </td>
                      <td>{toBR(r.drawDate)}</td>
                      <td>{r.isActive ? "✅" : "❌"}</td>
                      <td>{r.maxRaffleNumbers}</td>
                      <td>
                        {!isExpired && (isActiveRaffle || !hasActiveRaffle) ? (
                          <button
                            className={styles.button_status}
                            onClick={() =>
                              api
                                .put(`/raffle/${r.id}/set-active?isActive=${!r.isActive}`)
                                .then(() => window.location.reload())
                            }
                          >
                            {r.isActive ? "Desativar" : "Ativar"}
                          </button>
                        ) : !isExpired && hasActiveRaffle ? (
                          <span style={{ color: "gray" }}>Há sorteio ativo</span>
                        ) : (
                          <span style={{ color: "gray" }}>Data expirada</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </RequireAdmin>
  );
}