import { useState, useRef, useEffect, useCallback } from 'react';

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

  // Refs para controle de gestos (não causam re-render)
  const interactionRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialPinchDistance: 0,
    initialScale: 1,
  });

  const [isDraggingState, setIsDraggingState] = useState(false); // Apenas para mudar o cursor visualmente

  // --- Utilitários ---
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const calculateBounds = (scale: number, screenW: number, screenH: number) => {
    const mapW = MAP_WIDTH * scale;
    const mapH = MAP_HEIGHT * scale;
    // Lógica para centralizar se for menor, ou travar borda se for maior
    const minX = screenW > mapW ? (screenW - mapW) / 2 : screenW - mapW;
    const maxX = screenW > mapW ? (screenW - mapW) / 2 : 0;
    const minY = screenH > mapH ? (screenH - mapH) / 2 : screenH - mapH;
    const maxY = screenH > mapH ? (screenH - mapH) / 2 : 0;
    return { minX, maxX, minY, maxY };
  };

  // Calcula distância entre dois toques (Pitágoras)
  const getDistance = (touches: React.TouchList) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  // Calcula o ponto central entre dois toques
  const getMidpoint = (touches: React.TouchList) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  // --- Inicialização ---
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const scaleX = width / MAP_WIDTH;
      const scaleY = height / MAP_HEIGHT;
      
      // Começa preenchendo a tela (Cover)
      const coverScale = Math.max(scaleX, scaleY) * 1.05;

      setMapState({
        scale: coverScale,
        x: (width - MAP_WIDTH * coverScale) / 2,
        y: (height - MAP_HEIGHT * coverScale) / 2
      });
    }
  }, []);

  // --- Lógica de Zoom (Mouse Wheel) ---
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Evita zoom da página se o browser permitir (mas touch-action no CSS é o principal)
    // e.preventDefault(); // React synthetic events as vezes não pegam isso, por isso o CSS
    
    if (!containerRef.current) return;
    const { width: screenW, height: screenH } = containerRef.current.getBoundingClientRect();

    const zoomDelta = Math.exp(-e.deltaY * 0.001);
    let newScale = mapState.scale * zoomDelta;

    const fitScaleX = screenW / MAP_WIDTH;
    const fitScaleY = screenH / MAP_HEIGHT;
    
    // PERMITE ZOOM OUT TOTAL: Multiplico por 0.85 para dar uma margem extra
    const minScale = Math.min(fitScaleX, fitScaleY) * 0.85; 
    const maxScale = 5;

    newScale = clamp(newScale, minScale, maxScale);

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newX = mouseX - (mouseX - mapState.x) * (newScale / mapState.scale);
    let newY = mouseY - (mouseY - mapState.y) * (newScale / mapState.scale);

    const { minX, maxX, minY, maxY } = calculateBounds(newScale, screenW, screenH);
    setMapState({ scale: newScale, x: clamp(newX, minX, maxX), y: clamp(newY, minY, maxY) });
  }, [mapState]);

  // --- Lógica de Mouse (Desktop) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    interactionRef.current.isDragging = true;
    interactionRef.current.startX = e.clientX - mapState.x;
    interactionRef.current.startY = e.clientY - mapState.y;
    setIsDraggingState(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactionRef.current.isDragging || !containerRef.current) return;
    e.preventDefault();

    const { width, height } = containerRef.current.getBoundingClientRect();
    let nextX = e.clientX - interactionRef.current.startX;
    let nextY = e.clientY - interactionRef.current.startY;

    const { minX, maxX, minY, maxY } = calculateBounds(mapState.scale, width, height);
    setMapState(prev => ({ 
      ...prev, 
      x: clamp(nextX, minX, maxX), 
      y: clamp(nextY, minY, maxY) 
    }));
  };

  const handleMouseUp = () => {
    interactionRef.current.isDragging = false;
    setIsDraggingState(false);
  };

  // --- Lógica de Toque (Mobile - Pinch & Pan) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Um dedo: Arrastar
      interactionRef.current.isDragging = true;
      interactionRef.current.startX = e.touches[0].clientX - mapState.x;
      interactionRef.current.startY = e.touches[0].clientY - mapState.y;
    } else if (e.touches.length === 2) {
      // Dois dedos: Inicio do Zoom (Pinch)
      interactionRef.current.isDragging = false; // Pausa o arrasto simples
      interactionRef.current.initialPinchDistance = getDistance(e.touches);
      interactionRef.current.initialScale = mapState.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const { width: screenW, height: screenH } = containerRef.current.getBoundingClientRect();

    // Caso 1: Arrastar (Pan)
    if (e.touches.length === 1 && interactionRef.current.isDragging) {
      let nextX = e.touches[0].clientX - interactionRef.current.startX;
      let nextY = e.touches[0].clientY - interactionRef.current.startY;

      const { minX, maxX, minY, maxY } = calculateBounds(mapState.scale, screenW, screenH);
      setMapState(prev => ({ 
        ...prev, 
        x: clamp(nextX, minX, maxX), 
        y: clamp(nextY, minY, maxY) 
      }));
    } 
    
    // Caso 2: Zoom (Pinch)
    else if (e.touches.length === 2) {
      const currentDistance = getDistance(e.touches);
      const initialDistance = interactionRef.current.initialPinchDistance;

      if (initialDistance > 0) {
        // Fator de crescimento
        const scaleFactor = currentDistance / initialDistance;
        let newScale = interactionRef.current.initialScale * scaleFactor;

        // Limites (Min/Max)
        const fitScaleX = screenW / MAP_WIDTH;
        const fitScaleY = screenH / MAP_HEIGHT;
        const minScale = Math.min(fitScaleX, fitScaleY) * 0.85; // Buffer de zoom out
        const maxScale = 5;

        newScale = clamp(newScale, minScale, maxScale);

        // Zoom focado no centro dos dois dedos
        const midPoint = getMidpoint(e.touches);
        // Precisamos ajustar o ponto relativo ao container
        const rect = containerRef.current.getBoundingClientRect();
        const touchX = midPoint.x - rect.left;
        const touchY = midPoint.y - rect.top;

        // Matemática de zoom focado:
        // NovaPos = PontoMouse - (PontoMouse - PosAntiga) * (NovoScale / ScaleAntigo)
        // Nota: Usamos mapState.scale (estado atual renderizado) para suavidade, ou initialScale se quiser snap
        // Aqui usamos uma aproximação baseada na mudança relativa para manter estabilidade
        
        let newX = touchX - (touchX - mapState.x) * (newScale / mapState.scale);
        let newY = touchY - (touchY - mapState.y) * (newScale / mapState.scale);

        const { minX, maxX, minY, maxY } = calculateBounds(newScale, screenW, screenH);

        setMapState({
          scale: newScale,
          x: clamp(newX, minX, maxX),
          y: clamp(newY, minY, maxY)
        });
      }
    }
  };

  const handleTouchEnd = () => {
    interactionRef.current.isDragging = false;
    interactionRef.current.initialPinchDistance = 0;
  };

  return {
    containerRef,
    mapState,
    bind: {
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      // Eventos de Toque
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: {
        transform: `translate(${mapState.x}px, ${mapState.y}px) scale(${mapState.scale})`,
        cursor: isDraggingState ? 'grabbing' : 'grab',
        // CRUCIAL PARA MOBILE: Impede o navegador de dar zoom na página toda
        touchAction: 'none' as const, 
      }
    }
  };
};