"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Para ler ?token=XYZ
import dynamic from "next/dynamic";
import styles from "./home.module.css";

// --- SERVICES ---
import { validateQrToken } from "../../services/eventService";
import { getEnvironmentById } from "../../services/getEnvironmentService";

// --- COMPONENTES ---
import SideMenu from "../../components/SideMenu";
import EventHUD, { EnvironmentData } from "../../components/EventHUD"; // Importe a tipagem do HUD
import SponsorTicker from "../../components/SponsorTicker";
import LiveUsersWidget from "../../components/LiveUsersWidget";
import NoEventScreen from "../../components/NoEventScreen";
import LoadingScreen from "../../components/LoadingScreen";

// --- MAPA (Carregamento Dinâmico) ---
// ssr: false é vital para mapas que usam window/canvas
const MapPage = dynamic(() => import("../../components/Map/index"), {
  ssr: false,
  loading: () => null // Deixa o LoadingScreen principal controlar a UX
});

export default function HomePage() {
  // 1. Captura o token da URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // 2. Estados da Aplicação
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando sistema...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // O dado que vai alimentar o HUD e futuramente configurar o mapa
  const [eventData, setEventData] = useState<EnvironmentData | null>(null);

  // 3. O "Cérebro" da Página
  useEffect(() => {
    // Se entrar sem token, rejeita imediatamente
    if (!token) {
      setErrorMsg("Nenhum código de acesso detectado.");
      setIsLoading(false);
      return;
    }

const initPage = async () => {
      try {
        setLoadingMessage("Validando e carregando evento...");
        
        // Agora esta função já traz TUDO
        const fullData = await validateQrToken(token);
        
        // Precisamos apenas adaptar o nome das propriedades se forem diferentes
        // No DTO retornamos "environmentName", mas o HUD espera "name"
        const adaptedData: EnvironmentData = {
            idEnvironments: fullData.environmentId,
            name: fullData.environmentName, // Adapter simples
            description: fullData.description,
            type: fullData.type,
            locationName: fullData.locationName,
            startDate: fullData.startDate,
            endDate: fullData.endDate,
            status: fullData.status
        };

        setEventData(adaptedData);

      } catch (err: any) {
        console.error("Erro na inicialização:", err);
        // Pega a mensagem amigável do backend ou usa uma genérica
        setErrorMsg(err.message || "Falha ao carregar o evento. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [token]);

  // --- RENDERIZAÇÃO CONDICIONAL ---

  // CASO 1: Carregando
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  // CASO 2: Erro (Token inválido, expirado ou erro de rede)
  if (errorMsg || !eventData) {
    return <NoEventScreen message={errorMsg || "Acesso não autorizado."} />;
  }

  // CASO 3: Sucesso (Mostra o App Completo)
  return (
    <main className={styles.screenContainer}>
      
      {/* CAMADA 1: O Mundo 3D/2D */}
      <div className={styles.layerMap}>
        <MapPage />
      </div>

      {/* CAMADA 2: Interface de Usuário (HUDs) */}
      <div className={styles.layerInterface}>
        
        {/* Topo Direito: Detalhes do Evento */}
        <div className={styles.hudWrapper}>
             {/* Passamos o eventData preenchido para o HUD "Burro" exibir */}
             <EventHUD data={eventData} />
        </div>
        
        {/* Baixo Centro: Patrocinadores */}
        <div className={styles.tickerWrapper}>
             <SponsorTicker />
        </div>

        {/* Baixo Esquerda (ou Topo Centro no Mobile): Usuários Online */}
        <div className={styles.usersWrapper}>
             <LiveUsersWidget />
        </div>

      </div>

      {/* CAMADA 3: Menu Lateral e Modais */}
      <div className={styles.layerOverlay}>
        <SideMenu />
      </div>

    </main>
  );
}