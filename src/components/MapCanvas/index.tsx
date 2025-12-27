"use client";

import { useRef } from "react";
import { useMapInteractions } from "../../hooks/useMapInteractions/useMapInteractions";
//import Avatar from "@/components/Avatar";
import styles from "./map.module.css";

interface MapCanvasProps {
  eventData: {
    participants: { id: number; name: string; x: number; y: number }[];
  };
}

// CORREÇÃO AQUI: Usando camelCase para acessar as classes do CSS Module
const Table = ({ x, y }: { x: number; y: number }) => (
  <div className={styles.tableSet} style={{ left: x, top: y }}>
    <div className={`${styles.chair} ${styles.cTop}`} />
    <div className={`${styles.chair} ${styles.cBottom}`} />
    <div className={`${styles.chair} ${styles.cLeft}`} />
    <div className={`${styles.chair} ${styles.cRight}`} />
  </div>
);

export default function MapCanvas({ eventData }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { transform, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel } =
    useMapInteractions(containerRef);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
        position: "relative"
      }}
    >
      <div
        ref={containerRef}
        className={styles.mapContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
      >
        {/* --- CAMADA DE INFRAESTRUTURA --- */}

        {/* 1. PALCO PRINCIPAL */}
        <div className={`${styles.area} ${styles.mainStage}`}>
          <span className={styles.areaTitle}>PALCO PRINCIPAL</span>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>ÁREA RESTRITA - STAFF ONLY</div>
        </div>

        {/* 2. PISTA DE DANÇA */}
        <div className={`${styles.area} ${styles.danceFloor}`}>
          <span style={{ opacity: 0.3, fontSize: '3rem', fontWeight: 900 }}>PISTA</span>
        </div>

        {/* 3. ÁREA VIP */}
        <div className={`${styles.area} ${styles.vipArea}`}>
          <span className={styles.areaTitle}>CAMAROTE VIP</span>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Table x={80} y={100} /> <Table x={240} y={100} />
            <Table x={80} y={250} /> <Table x={240} y={250} />
            <Table x={80} y={400} /> <Table x={240} y={400} />
          </div>
        </div>

        {/* 4. PRAÇA DE ALIMENTAÇÃO */}
        <div className={`${styles.area} ${styles.foodCourt}`}>
          <span className={styles.areaTitle}>ALIMENTAÇÃO</span>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Table x={100} y={80} /> <Table x={220} y={80} />
            <Table x={100} y={220} /> <Table x={220} y={220} />
            <Table x={160} y={350} />
          </div>
        </div>

        {/* 5. BAR CENTRAL */}
        <div className={`${styles.area} ${styles.centralBar}`}>
          <span className={styles.areaTitle}>BAR CENTRAL</span>
          <div style={{ fontSize: '0.7rem' }}>BEBIDAS & DRINKS</div>
        </div>

        {/* 6. BANHEIROS */}
        <div className={`${styles.area} ${styles.restroom} ${styles.restroomLeft}`}>
          <span className={styles.areaTitle}>WC MASC</span>
        </div>
        <div className={`${styles.area} ${styles.restroom} ${styles.restroomRight}`}>
          <span className={styles.areaTitle}>WC FEM</span>
        </div>

        {/* 7. ENFERMARIA */}
        <div className={`${styles.area} ${styles.medic}`}>
          <span style={{ fontSize: '2rem' }}>+</span>
          <span>ENFERMARIA</span>
        </div>

        {/* 8. CREDENCIAMENTO */}
        <div className={`${styles.area} ${styles.reception}`}>
          <span className={styles.areaTitle}>CREDENCIAMENTO / ENTRADA</span>
          <div style={{ 
            display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.8rem' 
          }}>
            <div style={{ border: '1px solid cyan', padding: '5px 15px' }}>GUICHÊ 01</div>
            <div style={{ border: '1px solid cyan', padding: '5px 15px' }}>GUICHÊ 02</div>
            <div style={{ border: '1px solid cyan', padding: '5px 15px' }}>GUICHÊ 03</div>
          </div>
        </div>


        
      </div>

      {/* Interface Fixa (HUD) */}
      <div style={{
        position: 'absolute', bottom: 20, left: 20,
        color: 'var(--neon-cyan)', fontFamily: 'Orbitron, sans-serif',
        pointerEvents: 'none', background: 'rgba(0,0,0,0.5)', padding: '10px'
      }}>
        <div>X: {Math.round(transform.x)} | Y: {Math.round(transform.y)}</div>
        <div>ZOOM: {transform.scale.toFixed(2)}x</div>
      </div>
    </div>
  );
}