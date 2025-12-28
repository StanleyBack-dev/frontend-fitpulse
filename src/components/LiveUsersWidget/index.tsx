"use client";
import React, { useState, useEffect } from 'react';
import { Users, Activity } from 'lucide-react';
import styles from './liveUsers.module.css';

export default function LiveUsersWidget() {
  // Começa com um número base
  const [count, setCount] = useState(1240);

  // Simula oscilação de usuários em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2; // Varia entre -2 e +2
      setCount(prev => prev + change);
    }, 3000); // Atualiza a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {/* Bolinha Pulsante (Indicador de Live) */}
      <div className={styles.indicator}>
        <span className={styles.ping}></span>
        <span className={styles.dot}></span>
      </div>

      {/* Ícone e Número */}
      <div className={styles.content}>
        <span className={styles.count}>{count.toLocaleString()}</span>
        <span className={styles.label}>online</span>
      </div>
      
      {/* Ícone discreto de gráfico */}
      <Activity size={14} className={styles.icon} />
    </div>
  );
}