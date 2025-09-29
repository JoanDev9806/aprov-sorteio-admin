"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, setAdminToken } from "@/services/adminAuthService";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) return alert("Preencha usuário e senha.");

    setLoading(true);
    try {
      const res = await adminLogin({ username, password });
      if (!res?.success) {
        alert(res?.message ?? "Login inválido");
        return;
      }
      setAdminToken(res.token);
      router.replace("/raffles"); // para onde quiser enviar
    } catch (err) {
      console.error(err);
      alert("Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 16
    }}>
      <form onSubmit={handleSubmit} style={{
        width: 360, background: "#fff", borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        padding: 24, display: "grid", gap: 12
      }}>
        <h2 style={{marginBottom: 8}}>Login do Admin</h2>

        <label>Usuário</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="user"
          autoComplete="username"
        />

        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="********"
          autoComplete="current-password"
        />

        <button disabled={loading} style={{
          height: 40, borderRadius: 10, border: "none", fontWeight: 700,
          background: "#111", color: "#fff", cursor: "pointer"
        }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}