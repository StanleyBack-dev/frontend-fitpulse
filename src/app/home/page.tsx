"use client";

import { useEnvironmentData } from "@/hooks/useEnvironmentData/useEnvironmentData";
import LoadingScreen from "@/components/LoadingScreen";
import MapCanvas from "@/components/MapCanvas";

export default function HomePage() {
  const { eventData, loading } = useEnvironmentData();

  if (loading) return <LoadingScreen message="Carregando evento..." />;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapCanvas eventData={eventData} />
    </div>
  );
}