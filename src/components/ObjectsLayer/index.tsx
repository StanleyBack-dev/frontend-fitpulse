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
  top: string;
  left: string;
  width: number;
  height: number;
  shape: ShapeType;
  color: string;
};

// AUMENTEI OS TAMANHOS (Escala ~1.8x maior que o anterior)
// Como o mapa tem 2500px, temos bastante espaço.
const areas: MapArea[] = [
  {
    id: "hub-central",
    nome: "HUB CENTRAL",
    icon: Zap,
    top: "50%",
    left: "50%",
    width: 360,   // Antes era 200
    height: 360,  // Antes era 200
    shape: "hexagon",
    color: "#a855f7",
  },
  {
    id: "entrada",
    nome: "Entrada",
    icon: DoorOpen,
    top: "88%",   // Ajustei um pouco pra baixo pois o objeto cresceu
    left: "50%",
    width: 280,   // Antes 160
    height: 140,  // Antes 100
    shape: "rectangle",
    color: "#60a5fa",
  },
  {
    id: "palestras",
    nome: "Main Stage",
    icon: Mic2,
    top: "20%",   // Ajustei pra cima
    left: "50%",
    width: 320,   // Antes 180
    height: 320,
    shape: "circle",
    color: "#ff0077",
  },
  {
    id: "networking",
    nome: "Networking",
    icon: Users,
    top: "50%",
    left: "82%",
    width: 280,
    height: 200,
    shape: "rectangle",
    color: "#00c3ff",
  },
  {
    id: "mentoria",
    nome: "Mentoria",
    icon: Lightbulb,
    top: "50%",
    left: "18%",
    width: 260,
    height: 260,
    shape: "hexagon",
    color: "#facc15",
  },
  {
    id: "descanso",
    nome: "Lounge",
    icon: Coffee,
    top: "75%",
    left: "20%",
    width: 240,
    height: 240,
    shape: "circle",
    color: "#f97316",
  },
  {
    id: "exposicao",
    nome: "Expo Hall",
    icon: LayoutDashboard,
    top: "75%",
    left: "80%",
    width: 280,
    height: 180,
    shape: "rectangle",
    color: "#22c55e",
  },
  {
    id: "vip",
    nome: "VIP Area",
    icon: Star,
    top: "15%",
    left: "85%",
    width: 200,
    height: 200,
    shape: "square",
    color: "#ec4899",
  },
];

export default function ObjectsLayer() {
  
  // Aumentei o strokeWidth para acompanhar o tamanho
  const renderShape = (type: ShapeType, w: number, h: number, color: string) => {
    const strokeW = 5; // Borda mais grossa
    const style = { stroke: color, strokeWidth: strokeW, fill: `${color}15` };
    
    switch (type) {
      case "circle":
        return <circle cx="50%" cy="50%" r={(w/2) - strokeW} {...style} />;
      case "square":
      case "rectangle":
        // Aumentei o rx (border-radius) para 20
        return <rect x={strokeW} y={strokeW} width={w - strokeW*2} height={h - strokeW*2} rx="20" {...style} />;
      case "hexagon":
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
            "--glow-color": area.color,
          } as React.CSSProperties}
        >
          <svg className={styles.svgShape} width="100%" height="100%">
            <filter id={`glow-${area.id}`}>
              <feGaussianBlur stdDeviation="4" result="coloredBlur" /> {/* Blur maior */}
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {renderShape(area.shape, area.width, area.height, area.color)}
          </svg>

          <div className={styles.content}>
            {/* Ícone agora tem tamanho fixo maior (48px) para não sumir no objeto grande */}
            <area.icon size={48} className={styles.icon} color={area.color} />
            
            <span className={styles.label} style={{ textShadow: `0 0 15px ${area.color}` }}>
              {area.nome}
            </span>
          </div>

          <div className={styles.anchorDot} style={{ backgroundColor: area.color }}></div>
        </div>
      ))}
    </div>
  );
}