"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import { useRouter, usePathname } from "next/navigation";
import { clearAdminToken, isAdminLogged } from "@/services/adminAuthService";
import RequireAdmin from "../RequireAdmin/RequireAdmin";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const logged = isAdminLogged();
  function logout() {
    clearAdminToken();
    router.replace("/login");
  }
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Aprov Admin</div>
      {logged && 
      <React.Fragment> 
      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

        <div className={`${styles.links} ${menuOpen ? styles.show : ""}`}>
          <Link href="/raffles/create" onClick={() => setMenuOpen(false)}>Criar Sorteio</Link>
          <Link href="/raffles" onClick={() => setMenuOpen(false)}>Sorteio Ativo</Link>
          <Link href="/raffles/winner" onClick={() => setMenuOpen(false)}>Definir Vencedor</Link>
          <Link href="/raffles/raffle-owner" onClick={() => setMenuOpen(false)}>Buscar Número</Link>
          <Link href="/raffles/export-data" onClick={() => setMenuOpen(false)}>Gerar relatório</Link>
          {logged ? (
            <button onClick={logout} className={styles.logout_style}>Sair</button>
          ) : (
            pathname !== "/login" && (
              <button onClick={() => router.push("/login")} className={styles.logout_style}>Login</button>
            )
          )}
        </div>
        </React.Fragment>}

    </nav>
  );
}