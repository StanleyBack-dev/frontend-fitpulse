import { useState, useRef, useEffect, useCallback } from 'react';

// Tamanho fixo do seu mapa
const MAP_WIDTH = 2500;
const MAP_HEIGHT = 2500;

interface MapState {
  scale: number;
  x: number;
  y: number;
}

export const useMapNavigation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [mapState, setMapState] = useState<MapState>({
    scale: 1,
    x: 0,
    y: 0
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Utilitário para limites
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  // Utilitário para calcular bordas (evita tela preta ao arrastar)
  const calculateBounds = (scale: number, screenW: number, screenH: number) => {
    const mapW = MAP_WIDTH * scale;
    const mapH = MAP_HEIGHT * scale;

    const minX = screenW > mapW ? (screenW - mapW) / 2 : screenW - mapW;
    const maxX = screenW > mapW ? (screenW - mapW) / 2 : 0;
    
    const minY = screenH > mapH ? (screenH - mapH) / 2 : screenH - mapH;
    const maxY = screenH > mapH ? (screenH - mapH) / 2 : 0;

    return { minX, maxX, minY, maxY };
  };

  // 1. INICIALIZAÇÃO (A Mágica acontece aqui)
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      const scaleX = width / MAP_WIDTH;
      const scaleY = height / MAP_HEIGHT;

      // MUDANÇA CRUCIAL: Math.max garante o modo "COVER" (Preencher)
      // Math.min faria o modo "CONTAIN" (Ver tudo)
      const coverScale = Math.max(scaleX, scaleY); 
      
      // Opcional: Adicionar um pouquinho extra (1.1x) para garantir que não mostre borda nenhuma
      const initialScale = coverScale * 1.05; 

      setMapState({
        scale: initialScale,
        // Centraliza o mapa inicialmente
        x: (width - MAP_WIDTH * initialScale) / 2,
        y: (height - MAP_HEIGHT * initialScale) / 2
      });
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const { width: screenW, height: screenH } = containerRef.current.getBoundingClientRect();
    
    const scaleSensitivity = 0.001;
    const zoomDelta = Math.exp(-e.deltaY * scaleSensitivity);
    
    let newScale = mapState.scale * zoomDelta;

    // Calcula os limites de zoom permitido
    const fitScaleX = screenW / MAP_WIDTH;
    const fitScaleY = screenH / MAP_HEIGHT;
    
    // Aqui usamos Math.min para permitir que o usuário DÊ ZOOM OUT até ver o mapa todo se quiser
    const minScale = Math.min(fitScaleX, fitScaleY); 
    const maxScale = 4; // Zoom máximo

    newScale = clamp(newScale, minScale, maxScale);

    // Zoom focado no mouse
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newX = mouseX - (mouseX - mapState.x) * (newScale / mapState.scale);
    let newY = mouseY - (mouseY - mapState.y) * (newScale / mapState.scale);

    // Aplica limites de borda
    const { minX, maxX, minY, maxY } = calculateBounds(newScale, screenW, screenH);
    
    newX = clamp(newX, minX, maxX);
    newY = clamp(newY, minY, maxY);

    setMapState({ scale: newScale, x: newX, y: newY });
  }, [mapState]);

  // Funções de arrastar (mantidas iguais)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPan({ x: e.clientX - mapState.x, y: e.clientY - mapState.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const { width: screenW, height: screenH } = containerRef.current.getBoundingClientRect();
    let nextX = e.clientX - startPan.x;
    let nextY = e.clientY - startPan.y;

    const { minX, maxX, minY, maxY } = calculateBounds(mapState.scale, screenW, screenH);

    nextX = clamp(nextX, minX, maxX);
    nextY = clamp(nextY, minY, maxY);

    setMapState(prev => ({ ...prev, x: nextX, y: nextY }));
  };

  const handleMouseUp = () => setIsDragging(false);

  return {
    containerRef,
    mapState,
    bind: {
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      style: {
        transform: `translate(${mapState.x}px, ${mapState.y}px) scale(${mapState.scale})`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }
    }
  };
};