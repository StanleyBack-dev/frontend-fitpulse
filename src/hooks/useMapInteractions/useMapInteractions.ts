"use client";
import { useState, useRef } from "react";

export const useMapInteractions = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setTransform((t) => {
      const scale = Math.min(Math.max(t.scale - e.deltaY * 0.001, 0.5), 2);
      return { ...t, scale };
    });
  };

  return { transform, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel };
};