"use client";

import React from "react";
import dynamic from "next/dynamic";
import styles from "./home.module.css";
import SideMenu from "../../components/SideMenu";
import EventHUD from "../../components/EventHUD"; // Importe aqui

const MapPage = dynamic(() => import("../../components/Map/index"), {
  ssr: false,
});

// Exemplo de dados mockados (Substituir pela chamada da API do NestJS)
const mockEventData = {
  name: "Tech Summit 2025 - Edição Goiás",
  type: "Conferência",
  locationName: "Centro de Convenções de Goiânia",
  startDate: "2025-10-15T09:00:00",
  endDate: "2025-10-18T18:00:00",
  description: "O maior evento de tecnologia do centro-oeste com foco em IA e mapas interativos."
};

export default function HomePage() {
  return (
    <main className={styles.container}>
      
      {/* 1. Menu na Esquerda */}
      <SideMenu />

      {/* 2. Informações do Evento na Direita (Sobre o mapa) */}
      <EventHUD data={mockEventData} />

      {/* 3. O Mapa */}
      <section className={styles.mapSection}>
        <MapPage />
      </section>
      
    </main>
  );
}