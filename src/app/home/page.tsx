"use client";

import React, { useEffect, useState, Suspense } from "react"; // <--- Importe Suspense
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./home.module.css";

// --- SERVICES ---
import { validateQrToken } from "../../services/eventService";

// --- COMPONENTES ---
import SideMenu from "../../components/SideMenu";
import EventHUD, { EnvironmentData } from "../../components/EventHUD";
import SponsorTicker from "../../components/SponsorTicker";
import LiveUsersWidget from "../../components/LiveUsersWidget";
import NoEventScreen from "../../components/NoEventScreen";
import LoadingScreen from "../../components/LoadingScreen";

// --- MAPA ---
const MapPage = dynamic(() => import("../../components/Map/index"), {
  ssr: false,
  loading: () => null
});

// ------------------------------------------------------------------
// 1. CRIAMOS UM COMPONENTE INTERNO PARA A LÓGICA (CLIENT COMPONENT)
// ------------------------------------------------------------------
function HomeContent() {
  const searchParams = useSearchParams(); // O erro acontecia aqui antes
  const token = searchParams.get("token");

  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando sistema...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EnvironmentData | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMsg("Nenhum código de acesso detectado.");
      setIsLoading(false);
      return;
    }

    const initPage = async () => {
      try {
        setLoadingMessage("Validando credenciais...");
        
        // Agora o validateQrToken já retorna TUDO (ID + Dados)
        const fullData = await validateQrToken(token);
        
        // Adaptador (caso os nomes dos campos variem um pouco)
        const adaptedData: EnvironmentData = {
            idEnvironments: fullData.environmentId,
            name: fullData.environmentName,
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
        setErrorMsg(err.message || "Falha ao carregar o evento.");
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [token]);

  // Renders Condicionais
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  if (errorMsg || !eventData) {
    return <NoEventScreen message={errorMsg || "Acesso não autorizado."} />;
  }

  return (
    <main className={styles.screenContainer}>
      <div className={styles.layerMap}>
        <MapPage />
      </div>

      <div className={styles.layerInterface}>
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

      <div className={styles.layerOverlay}>
        <SideMenu />
      </div>
    </main>
  );
}

// ------------------------------------------------------------------
// 2. O COMPONENTE EXPORTADO AGORA É APENAS UM WRAPPER COM SUSPENSE
// ------------------------------------------------------------------
export default function HomePage() {
  return (
    // O fallback é o que aparece enquanto o Next.js tenta ler a URL no servidor
    <Suspense fallback={<LoadingScreen message="Carregando..." />}>
      <HomeContent />
    </Suspense>
  );
}