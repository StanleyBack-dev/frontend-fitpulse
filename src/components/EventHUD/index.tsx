"use client";

import React, { useState } from "react";
import styles from "./eventHud.module.css";
import { MapPin, Calendar, Info, ChevronUp, ChevronDown, Activity } from "lucide-react";

// Definição da tipagem exata que vem do seu Service/GraphQL
export interface EnvironmentData {
  idEnvironments: string;
  name: string;
  description?: string;
  type?: string;
  locationName?: string;
  startDate?: string; // GraphQL geralmente manda datas como string ISO
  endDate?: string;
  status?: string;
}

// Helper de formatação de data
const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  } catch {
    return dateString;
  }
};

export default function EventHUD({ data }: { data: EnvironmentData | null }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Se os dados ainda não chegaram (por algum motivo), não quebra a tela
  if (!data) return null;

  // Lógica de Status (Ao Vivo vs Encerrado)
  const getStatus = () => {
    const now = new Date();
    const start = data.startDate ? new Date(data.startDate) : null;
    const end = data.endDate ? new Date(data.endDate) : null;

    if (data.status !== 'ACTIVE') return { text: "CANCELADO", color: styles.statusInactive };
    if (start && end && now >= start && now <= end) return { text: "AO VIVO", color: styles.statusLive, pulse: true };
    if (start && now < start) return { text: "EM BREVE", color: styles.statusFuture };
    if (end && now > end) return { text: "ENCERRADO", color: styles.statusEnded };
    
    return { text: data.type || "EVENTO", color: styles.statusDefault };
  };

  const status = getStatus();

  return (
    <div className={`${styles.hudContainer} ${isCollapsed ? styles.collapsed : ''}`}>
      
      {/* --- CABEÇALHO (Sempre visível) --- */}
      <div className={styles.header}>
        <div className={styles.topRow}>
          {/* Badge de Status */}
          <span className={`${styles.badge} ${status.color}`}>
            {status.pulse && <span className={styles.dot}></span>}
            {status.text}
          </span>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className={styles.toggleBtn}
            aria-label="Expandir detalhes"
          >
            {isCollapsed ? <ChevronDown size={18}/> : <ChevronUp size={18}/>}
          </button>
        </div>
        
        <h1 className={styles.eventName}>{data.name}</h1>
      </div>

      {/* --- CONTEÚDO (Expansível) --- */}
      <div className={styles.content}>
        
        {/* Localização */}
        {data.locationName && (
          <div className={styles.infoRow}>
            <MapPin size={16} className={styles.icon} />
            <span>{data.locationName}</span>
          </div>
        )}

        {/* Datas */}
        {(data.startDate || data.endDate) && (
          <div className={styles.infoRow}>
            <Calendar size={16} className={styles.icon} />
            <div className={styles.dates}>
              {data.startDate && <span>Início: {formatDate(data.startDate)}</span>}
              {data.endDate && <span>Fim: {formatDate(data.endDate)}</span>}
            </div>
          </div>
        )}

        {/* Descrição */}
        {data.description && (
          <div className={styles.descriptionBox}>
            <div className={styles.descLabel}>
               <Info size={12} style={{ marginRight: 4 }}/> Sobre
            </div>
            <p>{data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}