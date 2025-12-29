"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./home.module.css";
import { QrCode, Zap } from "lucide-react";

// --- SERVICES ---
import { validateQrToken } from "../../services/eventService";
import { checkSession } from "../../services/authService";

// --- COMPONENTES ---
import SideMenu from "../../components/SideMenu";
import EventHUD, { EnvironmentData } from "../../components/EventHUD";
import SponsorTicker from "../../components/SponsorTicker";
import LiveUsersWidget from "../../components/LiveUsersWidget";
import LoadingScreen from "../../components/LoadingScreen";
import QrScannerModal from "../../components/QrScannerModal";
import NoEventScreen from "../../components/NoEventScreen";
import LoginButton from "../../components/LoginButton";

// --- MAPA ---
const MapPage = dynamic(() => import("../../components/Map/index"), {
  ssr: false,
  loading: () => null
});

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando sistema...");
  
  // Controle de Estado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [eventData, setEventData] = useState<EnvironmentData | null>(null);
  
  // Controle do Scanner
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoadingMessage("Verificando acesso...");

        // 1. Verifica Sessão
        const session = await checkSession();
        const isAuth = session.authenticated;
        setIsAuthenticated(isAuth);

        // 2. Verifica QR Code de Evento
        if (token) {
          try {
            const fullData = await validateQrToken(token);
            setEventData({
                idEnvironments: fullData.environmentId,
                name: fullData.environmentName,
                description: fullData.description,
                type: fullData.type,
                locationName: fullData.locationName,
                startDate: fullData.startDate,
                endDate: fullData.endDate,
                status: fullData.status
            });
          } catch (qrError) {
            console.warn("Token de evento inválido, ignorando...");
            setEventData(null);
          }
        } else {
          setEventData(null);
        }

      } catch (err) {
        console.error("Erro crítico na home:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [token]);

  const handleScanSuccess = (newToken: string) => {
    setShowScanner(false);
    router.push(`/home?token=${newToken}`);
  };

  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  // CENÁRIO: NÃO AUTENTICADO E SEM EVENTO (Bloqueia tudo)
  if (!isAuthenticated && !eventData) {
    return (
      <NoEventScreen message="Para acessar, faça login ou escaneie um QR Code válido." />
    );
  }

  return (
    <main className={styles.screenContainer}>
      
      {/* --- CAMADA DE CONTEÚDO PRINCIPAL --- */}
      {eventData ? (
        // SE TEM EVENTO (Mapa + Interface do Evento)
        <>
          <div className={styles.layerMap}>
            <MapPage />
          </div>

          {/* Botão de Login Flutuante para Visitantes (Se não estiver autenticado) */}
          {!isAuthenticated && (
            <div className={styles.visitorLoginOverlay}>
               <LoginButton />
            </div>
          )}

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
        </>
      ) : (
        // SE NÃO TEM EVENTO (Mas está autenticado) -> Boas Vindas
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyContent}>
            <div className={styles.pulseIconWrapper}>
               <Zap size={64} className={styles.pulseIcon} />
            </div>
            <h1>Bem-vindo ao PULSE</h1>
            <p>Selecione uma opção no menu ou escaneie um evento para começar.</p>
            
            <button 
              className={styles.scanButton}
              onClick={() => setShowScanner(true)}
            >
              <QrCode size={20} />
              Escanear QR Code
            </button>
          </div>
        </div>
      )}

      {/* --- CAMADA DO MENU LATERAL (Apenas Autenticados) --- */}
      {isAuthenticated && (
        <div className={styles.layerOverlay}>
          {/* O SideMenu buscará seus próprios dados usando o service com deduplicação */}
          <SideMenu />
        </div>
      )}

      {/* MODAL SCANNER */}
      {showScanner && (
        <QrScannerModal 
          onClose={() => setShowScanner(false)} 
          onScan={handleScanSuccess} 
        />
      )}

    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingScreen message="Carregando..." />}>
      <HomeContent />
    </Suspense>
  );
}