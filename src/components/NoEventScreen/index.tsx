"use client";
import React, { useState } from "react";
import styles from "./noEvent.module.css";
import { AlertTriangle, QrCode, ArrowLeft } from "lucide-react";
import QrScannerModal from "../QrScannerModal";

interface NoEventScreenProps {
  message?: string;
}

export default function NoEventScreen({ message = "Nenhum evento localizado." }: NoEventScreenProps) {
  // Estado para controlar o modal
  const [showScanner, setShowScanner] = useState(false);

  // O que fazer quando ler o QR Code
  const handleScanSuccess = (token: string) => {
    setShowScanner(false);
    // Redireciona para a home passando o novo token lido
    window.location.href = `/home?token=${token}`;
  };

  return (
    <>
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
            {/* AGORA O BOTÃO ABRE O MODAL */}
            <button 
              className={styles.primaryBtn} 
              onClick={() => setShowScanner(true)}
            >
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

      {/* RENDERIZAÇÃO CONDICIONAL DO SCANNER */}
      {showScanner && (
        <QrScannerModal 
          onClose={() => setShowScanner(false)} 
          onScan={handleScanSuccess} 
        />
      )}
    </>
  );
}