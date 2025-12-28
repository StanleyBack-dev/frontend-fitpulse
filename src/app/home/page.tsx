"use client";

import React from "react";
import dynamic from "next/dynamic";
import styles from "./home.module.css";

// Componentes de UI
import SideMenu from "../../components/SideMenu";
import EventHUD from "../../components/EventHUD";
import SponsorTicker from "../../components/SponsorTicker";

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
      
      {/* CAMADA 1: O MUNDO (MAPA) */}
      {/* Fica no fundo absoluto. O zoom acontece AQUI dentro. */}
      <div className={styles.layerMap}>
        <MapPage />
      </div>

      {/* CAMADA 2: A INTERFACE (HUD, TICKER) */}
      {/* Cobre a tela toda, mas deixa o clique passar para o mapa */}
      <div className={styles.layerInterface}>
        <div className={styles.safeAreaTopRight}>
             <EventHUD data={mockEventData} />
        </div>
        
        <div className={styles.safeAreaBottom}>
             <SponsorTicker />
        </div>
      </div>

      {/* CAMADA 3: O MENU E MODAIS */}
      {/* Fica acima de tudo e bloqueia cliques quando aberto */}
      <div className={styles.layerOverlay}>
        <SideMenu />
      </div>

    </main>
  );
}