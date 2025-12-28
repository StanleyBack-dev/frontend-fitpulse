"use client";
import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { X } from "lucide-react";
import styles from "./qrScannerModal.module.css";

interface QrScannerModalProps {
  onClose: () => void;
  onScan: (token: string) => void;
}

export default function QrScannerModal({ onClose, onScan }: QrScannerModalProps) {
  
  const handleScan = (result: any) => {
    if (result) {
      // Ajuste para a versão mais recente que retorna um array de objetos
      const rawValue = result[0]?.rawValue;
      
      if (rawValue) {
        try {
          const url = new URL(rawValue);
          const token = url.searchParams.get("token");
          if (token) {
             onScan(token);
             return;
          }
        } catch (e) {
          // Se não for URL, passa o valor direto
        }
        onScan(rawValue);
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className={styles.title}>Escaneie o QR Code</h2>
        <p className={styles.subtitle}>Aponte a câmera para o código do evento</p>

        <div className={styles.scannerWrapper}>
          <Scanner 
            onScan={handleScan} 
            allowMultiple={false}
            scanDelay={2000} 
            // CORREÇÃO AQUI: Removemos o 'audio' de dentro de components
            components={{
                finder: true, // Mantemos apenas o finder (a moldura)
            }}
            styles={{
                container: { width: "100%", height: "100%" }
            }}
          />
        </div>

      </div>
    </div>
  );
}