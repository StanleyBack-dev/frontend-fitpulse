import { User, Bell } from "lucide-react";
import styles from "./header.module.css";

export default function Header({ userName = "Atleta" }) {
  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}><User size={20} /></div>
        <div>
          <p className={styles.greeting}>Olá, {userName}</p>
          <h2 className={styles.statusText}>Foco no objetivo! 🎯</h2>
        </div>
      </div>
      <button className={styles.iconBtn}><Bell size={24} /></button>
    </header>
  );
}