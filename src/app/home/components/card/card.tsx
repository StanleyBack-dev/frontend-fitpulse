import { Activity } from "lucide-react";
import styles from "./card.module.css";

export default function Card({ imc = 24.5, category = "Peso Ideal" }) {
  return (
    <section className={styles.summaryCard}>
      <div className={styles.summaryInfo}>
        <span className={styles.label}>Seu último IMC</span>
        <h3 className={styles.value}>{imc}</h3>
        <p className={styles.categoryTag}>{category}</p>
      </div>
      <div className={styles.chartMini}>
        <Activity size={48} className={styles.icon} />
      </div>
    </section>
  );
}