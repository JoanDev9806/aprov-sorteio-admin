"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
        <nav className={styles.navbar}>
          <div className={styles.logo}>Aprov Admin</div>
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
          </div>
        </nav>
  );
}