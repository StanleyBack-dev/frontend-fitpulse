"use client";

import React from "react";
import dynamic from "next/dynamic";
import styles from "./home.module.css";

// Componentes de UI
import SideMenu from "../../components/SideMenu";
import EventHUD from "../../components/EventHUD";
import SponsorTicker from "../../components/SponsorTicker";
import LiveUsersWidget from "../../components/LiveUsersWidget";

// Mapa (Carregamento Dinâmico)
const MapPage = dynamic(() => import("../../components/Map/index"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Carregando sistema...</div>
});

// Mock Data
const mockEventData = {
  name: "Tech Summit 2025",
  type: "Conferência",
  locationName: "Goiânia Arena",
  startDate: "2025-10-15T09:00:00",
  description: "Evento principal de tecnologia."
};

export default function HomePage() {
  return (
    <main className={styles.screenContainer}>
      
      {/* 1. MAPA */}
      <div className={styles.layerMap}>
        <MapPage />
      </div>

      {/* 2. INTERFACE */}
      <div className={styles.layerInterface}>
        
        {/* Topo Direito */}
        <div className={styles.hudWrapper}>
             <EventHUD data={mockEventData} />
        </div>
        
        {/* Baixo Centro */}
        <div className={styles.tickerWrapper}>
             <SponsorTicker />
        </div>

        {/* NOVO: Baixo Esquerda */}
        <div className={styles.usersWrapper}>
             <LiveUsersWidget />
        </div>

      </div>

      {/* 3. MENU */}
      <div className={styles.layerOverlay}>
        <SideMenu />
      </div>

    </main>
  );
}