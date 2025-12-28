import React from "react";
import styles from "./adslayer.module.css";

// Exemplo de dados de ADs (viriam do backend)
const ads = [
  {
    id: "ad-sponsor-1",
    imageUrl: "https://placehold.co/300x150/1a1a1a/a855f7?text=SPONSOR+TECH", // Link da imagem do patrocinador
    linkUrl: "https://google.com",
    top: "35%", // Posição % no mapa
    left: "20%",
    width: 180, // Tamanho fixo em PX no mapa
    height: 90,
    rotation: "-10deg" // Um leve ângulo pra dar estilo
  },
  {
    id: "ad-sponsor-2",
    imageUrl: "https://placehold.co/300x150/000000/00c3ff?text=FUTURE+DRINKS",
    linkUrl: "https://google.com",
    top: "65%",
    left: "85%",
    width: 160,
    height: 80,
    rotation: "15deg"
  },
  // Um maiorzão perto da entrada
  {
    id: "ad-main",
    imageUrl: "https://placehold.co/600x200/22c55e/ffffff?text=SUSTAINABLE+CODE+BOOTCAMP",
    linkUrl: "https://google.com",
    top: "92%",
    left: "25%",
    width: 240,
    height: 80,
    rotation: "0deg"
  }
];

export default function AdsLayer() {
  return (
    <div className={styles.adsContainer}>
      {ads.map((ad) => (
        <a 
          key={ad.id}
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.billboardWrapper}
          style={{
            top: ad.top,
            left: ad.left,
            width: ad.width,
            height: ad.height,
            transform: `translate(-50%, -50%) rotate(${ad.rotation})`
          } as React.CSSProperties}
        >
          {/* Efeito de "Holograma" */}
          <div className={styles.hologramEffect}></div>
          <div className={styles.scanline}></div>
          
          {/* A Imagem do Anúncio */}
          <img src={ad.imageUrl} alt="Advertisement" className={styles.adImage} />
          
          {/* Base do Billboard (Opcional, pra parecer que está no chão) */}
          <div className={styles.baseStand}></div>
        </a>
      ))}
    </div>
  );
}