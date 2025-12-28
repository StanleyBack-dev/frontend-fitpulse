import React from "react";
import styles from "./map.module.css";
import ObjectsLayer from "../../components/ObjectsLayer";
import InteractionLayer from "../../components/InteractionsLayer";
import AdsLayer from "../AdsLayer";
import { useMapNavigation } from "../../hooks/useMapNavigation";

export default function MapPage() {
  // Pegamos o containerRef também
  const { bind, containerRef } = useMapNavigation();

  return (
    // Ligamos o containerRef aqui para medir o tamanho da tela
    <main className={styles.container} ref={containerRef}>
      
      {/* O bind aplica o transform aqui */}
      <div className={styles.viewport} {...bind}>
        
        <div className={styles.mapBackground}>
          <div className={styles.gridOverlay}></div>

          <div className={styles.layers}>
            <AdsLayer />
            <ObjectsLayer />
            <InteractionLayer />
          </div>
        </div>

      </div>
    </main>
  );
}