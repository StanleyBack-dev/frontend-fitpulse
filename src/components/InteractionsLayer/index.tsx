"use client";

import React, { useState } from "react";
import styles from "./interaction.module.css";

type MapObject = {
  id: string;
  name: string;
  description: string;
  top: string;
  left: string;
};

const objects: MapObject[] = [
  {
    id: "base-01",
    name: "Base Central",
    description: "Centro de comando do mapa. Controla rotas principais.",
    top: "30%",
    left: "40%",
  },
  {
    id: "tower-01",
    name: "Torre Leste",
    description: "Ponto de observação avançado com sensores ativos.",
    top: "55%",
    left: "70%",
  },
  {
    id: "portal-01",
    name: "Portal Oeste",
    description: "Porta dimensional instável. Conecta áreas distantes.",
    top: "70%",
    left: "20%",
  },
];

export default function InteractionLayer() {
  const [hovered, setHovered] = useState<MapObject | null>(null);

  return (
    <div className={styles.interaction}>
      {objects.map((obj) => (
        <div
          key={obj.id}
          className={styles.hitbox}
          style={{ top: obj.top, left: obj.left }}
          onMouseEnter={() => setHovered(obj)}
          onMouseLeave={() => setHovered(null)}
        ></div>
      ))}

      {hovered && (
        <div
          className={styles.tooltip}
          style={{ top: `calc(${hovered.top} - 40px)`, left: hovered.left }}
        >
          <h4>{hovered.name}</h4>
          <p>{hovered.description}</p>
        </div>
      )}
    </div>
  );
}