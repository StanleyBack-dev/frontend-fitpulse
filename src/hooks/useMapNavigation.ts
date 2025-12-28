import { useState, useRef, useEffect, useCallback } from 'react';

// Mantemos o tamanho fixo definido anteriormente
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

  // Função que calcula limites e centraliza se necessário
  const calculateBounds = (scale: number, screenW: number, screenH: number) => {
    const mapW = MAP_WIDTH * scale;
    const mapH = MAP_HEIGHT * scale;

    // Se o mapa for MENOR que a tela, centraliza (min == max)
    // Se o mapa for MAIOR que a tela, permite arrastar (min negativo, max 0)
    
    const minX = screenW > mapW ? (screenW - mapW) / 2 : screenW - mapW;
    const maxX = screenW > mapW ? (screenW - mapW) / 2 : 0;
    
    const minY = screenH > mapH ? (screenH - mapH) / 2 : screenH - mapH;
    const maxY = screenH > mapH ? (screenH - mapH) / 2 : 0;

    return { minX, maxX, minY, maxY };
  };

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  // 1. Setup inicial (Centraliza mostrando o mapa TODO ou preenchendo, você escolhe)
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // MUDANÇA AQUI: Math.min fará o mapa caber inteiro na tela inicialmente
      const fitScale = Math.min(width / MAP_WIDTH, height / MAP_HEIGHT); 
      
      // Se quiser uma margem de segurança, multiplique por 0.9
      const safeScale = fitScale * 0.9; 

      setMapState({
        scale: safeScale,
        x: (width - MAP_WIDTH * safeScale) / 2,
        y: (height - MAP_HEIGHT * safeScale) / 2
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

    // 2. MUDANÇA NO LIMITE MÍNIMO DE ZOOM
    // Calculamos o scale necessário para caber largura e altura
    const fitScaleX = screenW / MAP_WIDTH;
    const fitScaleY = screenH / MAP_HEIGHT;
    
    // Math.min permite afastar até ver o mapa TODO.
    // Multipliquei por 0.8 para permitir afastar um pouco MAIS que o limite, deixando margem.
    const minScale = Math.min(fitScaleX, fitScaleY) * 0.8; 
    const maxScale = 4; 

    newScale = clamp(newScale, minScale, maxScale);

    // Lógica de Zoom no ponteiro do mouse
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newX = mouseX - (mouseX - mapState.x) * (newScale / mapState.scale);
    let newY = mouseY - (mouseY - mapState.y) * (newScale / mapState.scale);

    // Aplica os limites calculados
    const { minX, maxX, minY, maxY } = calculateBounds(newScale, screenW, screenH);
    
    newX = clamp(newX, minX, maxX);
    newY = clamp(newY, minY, maxY);

    setMapState({ scale: newScale, x: newX, y: newY });
  }, [mapState]);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPan({ x: e.clientX - mapState.x, y: e.clientY - mapState.y });
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