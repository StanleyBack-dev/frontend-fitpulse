"use client";

import { ArrowLeft } from "lucide-react";
import HealthForm from "./components/HealthForm";
import styles from "./health.module.css";

export default function HealthPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => window.history.back()} className={styles.backBtn}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Saúde</h1>
      </header>

      <HealthForm />
    </main>
  );
}