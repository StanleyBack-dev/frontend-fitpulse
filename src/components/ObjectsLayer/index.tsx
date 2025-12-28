import React from "react";
import styles from "./objects.module.css";
import { 
  Users, Zap, Coffee, Mic2, Star, 
  LayoutDashboard, DoorOpen, Lightbulb 
} from "lucide-react";

type ShapeType = "square" | "rectangle" | "hexagon" | "circle";

type MapArea = {
  id: string;
  nome: string;
  icon: React.ElementType;
  top: string;  // % do container do mapa
  left: string; // % do container do mapa
  width: number;
  height: number;
  shape: ShapeType;
  color: string;
};

// Layout organizado logicamente (considerando mapa 2500x2500)
// Centralizamos o Hub (50%, 50%) e espalhamos o resto
const areas: MapArea[] = [
  {
    id: "hub-central",
    nome: "HUB CENTRAL",
    icon: Zap,
    top: "50%",
    left: "50%",
    width: 200,
    height: 200,
    shape: "hexagon",
    color: "#a855f7", // Roxo
  },
  {
    id: "entrada",
    nome: "Entrada",
    icon: DoorOpen,
    top: "85%", // Bem embaixo
    left: "50%",
    width: 160,
    height: 100,
    shape: "rectangle",
    color: "#60a5fa", // Azul claro
  },
  {
    id: "palestras",
    nome: "Main Stage",
    icon: Mic2,
    top: "25%", // Topo
    left: "50%",
    width: 180,
    height: 180,
    shape: "circle",
    color: "#ff0077", // Rosa choque
  },
  {
    id: "networking",
    nome: "Networking",
    icon: Users,
    top: "50%",
    left: "80%", // Extrema direita
    width: 160,
    height: 120,
    shape: "rectangle",
    color: "#00c3ff", // Cyan
  },
  {
    id: "mentoria",
    nome: "Mentoria",
    icon: Lightbulb,
    top: "50%",
    left: "20%", // Extrema esquerda
    width: 150,
    height: 150,
    shape: "hexagon",
    color: "#facc15", // Amarelo
  },
  {
    id: "descanso",
    nome: "Lounge",
    icon: Coffee,
    top: "70%",
    left: "25%",
    width: 140,
    height: 140,
    shape: "circle",
    color: "#f97316", // Laranja
  },
  {
    id: "exposicao",
    nome: "Expo Hall",
    icon: LayoutDashboard,
    top: "70%",
    left: "75%",
    width: 160,
    height: 120,
    shape: "rectangle",
    color: "#22c55e", // Verde
  },
  {
    id: "vip",
    nome: "VIP Area",
    icon: Star,
    top: "20%",
    left: "80%", // Canto superior direito (exclusivo)
    width: 120,
    height: 120,
    shape: "square",
    color: "#ec4899", // Pink
  },
];

export default function ObjectsLayer() {
  
  // Renderizador de formas SVG
  const renderShape = (type: ShapeType, w: number, h: number, color: string) => {
    const strokeW = 3;
    const style = { stroke: color, strokeWidth: strokeW, fill: `${color}15` }; // 15 = transparência baixa
    
    switch (type) {
      case "circle":
        return <circle cx="50%" cy="50%" r={(w/2) - strokeW} {...style} />;
      case "square":
      case "rectangle":
        return <rect x={strokeW} y={strokeW} width={w - strokeW*2} height={h - strokeW*2} rx="12" {...style} />;
      case "hexagon":
        // Cálculo simples de hexágono SVG
        const p = strokeW; 
        const points = `
          ${w/2},${p} 
          ${w-p},${h*0.25} 
          ${w-p},${h*0.75} 
          ${w/2},${h-p} 
          ${p},${h*0.75} 
          ${p},${h*0.25}
        `;
        return <polygon points={points} {...style} strokeLinejoin="round" />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.objectsContainer}>
      {areas.map((area) => (
        <div
          key={area.id}
          className={styles.areaWrapper}
          style={{
            top: area.top,
            left: area.left,
            width: area.width,
            height: area.height,
            "--glow-color": area.color, // Variável CSS para usar no styles
          } as React.CSSProperties}
        >
          {/* SVG de Fundo (A forma) */}
          <svg className={styles.svgShape} width="100%" height="100%">
            <filter id={`glow-${area.id}`}>
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {renderShape(area.shape, area.width, area.height, area.color)}
          </svg>

          {/* Conteúdo (Ícone e Texto) */}
          <div className={styles.content}>
            <area.icon size={28} className={styles.icon} color={area.color} />
            <span className={styles.label} style={{ textShadow: `0 0 10px ${area.color}` }}>
              {area.nome}
            </span>
          </div>

          {/* Efeito de "Ponto de ancoragem" embaixo do objeto */}
          <div className={styles.anchorDot} style={{ backgroundColor: area.color }}></div>
        </div>
      ))}
    </div>
  );
}