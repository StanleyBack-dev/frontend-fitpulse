"use client";
import React from "react";
import styles from "./noEvent.module.css";
import { AlertTriangle, QrCode, ArrowLeft } from "lucide-react";

interface NoEventScreenProps {
  message?: string;
}

export default function NoEventScreen({ message = "Nenhum evento localizado." }: NoEventScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={48} className={styles.icon} />
        </div>
        
        <h1 className={styles.title}>Acesso Negado</h1>
        <p className={styles.description}>
          {message}
        </p>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => window.location.href = "/scan"}>
            <QrCode size={18} />
            Escanear Novamente
          </button>
          
          <button className={styles.secondaryBtn} onClick={() => window.location.href = "/"}>
            <ArrowLeft size={18} />
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}