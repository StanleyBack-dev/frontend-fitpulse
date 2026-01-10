import { LucideIcon } from "lucide-react";
import styles from "./card.module.css";

interface CardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  Icon: LucideIcon;
  color?: string; 
}

export default function Card({ 
  label, 
  value, 
  unit = "", 
  subtext, 
  Icon, 
  color = "#adff2f" 
}: CardProps) {
  return (
    <section className={styles.summaryCard} style={{ borderColor: `${color}40` }}>
      <div className={styles.summaryInfo}>
        <span className={styles.label}>{label}</span>
        <h3 className={styles.value} style={{ color: color }}>
          {value} <span className={styles.unit}>{unit}</span>
        </h3>
        {subtext && <p className={styles.categoryTag}>{subtext}</p>}
      </div>
      <div className={styles.chartMini} style={{ background: `${color}10` }}>
        <Icon size={28} className={styles.icon} style={{ color: color }} />
      </div>
    </section>
  );
}