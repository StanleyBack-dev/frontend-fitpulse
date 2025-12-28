"use client";

import React, { useState } from "react";
import styles from "./eventHud.module.css";
import { MapPin, Calendar, Info, ChevronUp, ChevronDown } from "lucide-react";

// Simulando a tipagem baseada no seu DTO
interface EnvironmentData {
  name: string;
  type?: string;
  locationName?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  description?: string;
}

// Helper para formatar datas bonitas (Ex: 12 OUT - 14:00)
const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "--/--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
  }).format(date);
};

export default function EventHUD({ data }: { data: EnvironmentData }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Lógica simples para ver se o evento está acontecendo agora
  const now = new Date();
  const start = data.startDate ? new Date(data.startDate) : null;
  const end = data.endDate ? new Date(data.endDate) : null;
  const isLive = start && end && now >= start && now <= end;

  return (
    <div className={`${styles.hudContainer} ${isCollapsed ? styles.collapsed : ''}`}>
      
      {/* Cabeçalho (Sempre visível) */}
      <div className={styles.header}>
        <div className={styles.statusRow}>
          {isLive ? (
             <span className={styles.liveBadge}><span className={styles.dot}></span> AO VIVO</span>
          ) : (
             <span className={styles.typeBadge}>{data.type || "EVENTO"}</span>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className={styles.toggleBtn}
          >
            {isCollapsed ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
          </button>
        </div>
        
        <h1 className={styles.eventName}>{data.name}</h1>
      </div>

      {/* Conteúdo (Ocultável) */}
      <div className={styles.content}>
        
        {data.locationName && (
          <div className={styles.infoRow}>
            <MapPin size={16} className={styles.icon} />
            <span>{data.locationName}</span>
          </div>
        )}

        {(data.startDate || data.endDate) && (
          <div className={styles.infoRow}>
            <Calendar size={16} className={styles.icon} />
            <div className={styles.dates}>
              <span>Início: {formatDate(data.startDate)}</span>
              {data.endDate && <span>Fim: {formatDate(data.endDate)}</span>}
            </div>
          </div>
        )}

        {data.description && (
          <div className={styles.description}>
            <Info size={14} className={styles.icon} style={{ marginTop: 2 }} />
            <p>{data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}