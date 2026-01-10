"use client";

import { useRouter } from "next/navigation";
import { PlusCircle, History, TrendingUp, Target } from "lucide-react";
import styles from "./menu.module.css";

export default function Menu() {
  const router = useRouter();

  const actions = [
    {
      icon: <PlusCircle />,
      label: "Novo IMC",
      color: "#adff2f",
      onClick: () => router.push("/saude"),
    },
    {
      icon: <History />,
      label: "Histórico",
      color: "#fff",
    },
    {
      icon: <TrendingUp />,
      label: "Evolução",
      color: "#fff",
    },
    {
      icon: <Target />,
      label: "Metas",
      color: "#fff",
    },
  ];

  return (
    <div className={styles.actionGrid}>
      {actions.map((item, i) => (
        <button
          key={i}
          className={styles.actionBtn}
          onClick={item.onClick}
          disabled={!item.onClick}
        >
          <div className={styles.actionIcon} style={{ color: item.color }}>
            {item.icon}
          </div>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}