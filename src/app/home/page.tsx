"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Hook do Next para ler URL
import dynamic from "next/dynamic";
import styles from "./home.module.css";
import { validateQrToken } from "../../services/eventService";

// Componentes de UI
import SideMenu from "../../components/SideMenu";
import EventHUD from "../../components/EventHUD";
import SponsorTicker from "../../components/SponsorTicker";
import LiveUsersWidget from "../../components/LiveUsersWidget";
import NoEventScreen from "../../components/NoEventScreen"; // Importe a tela de erro
import LoadingScreen from "../../components/LoadingScreen"; // Seu loading existente

// Mapa
const MapPage = dynamic(() => import("../../components/Map/index"), {
  ssr: false,
  loading: () => null // Deixa o loading screen principal cuidar disso
});

export default function HomePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Pega ?token=XYZ da URL

  // Estados da Máquina
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    // Se não tiver token na URL, já barra
    if (!token) {
      setErrorMsg("Nenhum código de evento fornecido. Escaneie um QR Code válido.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await validateQrToken(token);
        
        // Formata os dados vindos do backend para o formato que o HUD espera
        // O backend retorna: environmentId, environmentName, mapConfig
        // Precisamos adaptar para: startDate, locationName, etc (se o backend mandar isso futuramente)
        
        const formattedData = {
          name: data.environmentName,
          type: "Evento Ao Vivo", // Exemplo, ideal vir do backend
          locationName: "Localização do Evento", // Ideal vir do backend
          description: "Bem-vindo ao mapa interativo.",
          // mapConfig: data.mapConfig // Se você usar config dinâmica de mapa
        };

        setEventData(formattedData);
      } catch (err: any) {
        // Pega a mensagem de erro do backend (ex: "QR code expirado")
        setErrorMsg(err.message || "Evento inválido ou indisponível.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [token]);

  // 1. ESTADO DE LOADING
  if (loading) {
    return <LoadingScreen message="Acessando o Mainframe..." />;
  }

  // 2. ESTADO DE ERRO (SEM EVENTO)
  if (errorMsg || !eventData) {
    return <NoEventScreen message={errorMsg || "Acesso não autorizado."} />;
  }

  // 3. ESTADO DE SUCESSO (MOSTRA O MAPA)
  return (
    <main className={styles.screenContainer}>
      
      {/* MAPA */}
      <div className={styles.layerMap}>
        <MapPage />
      </div>

      {/* INTERFACE */}
      <div className={styles.layerInterface}>
        
        {/* HUD com dados REAIS do evento */}
        <div className={styles.hudWrapper}>
             <EventHUD data={eventData} />
        </div>
        
        <div className={styles.tickerWrapper}>
             <SponsorTicker />
        </div>

        <div className={styles.usersWrapper}>
             <LiveUsersWidget />
        </div>

      </div>

      {/* MENU */}
      <div className={styles.layerOverlay}>
        <SideMenu />
      </div>

    </main>
  );
}