"use client";

import { ArrowLeft } from "lucide-react";
import ProfileForm from "./components/ProfileForm";
import styles from "./perfil.module.css";

export default function ProfilePage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => window.history.back()} className={styles.backBtn}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Perfil</h1>
      </header>

      <ProfileForm />
    </main>
  );
}