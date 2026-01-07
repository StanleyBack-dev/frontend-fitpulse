"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./toast.module.css";

interface ToastProps {
  id: string;
  type: "success" | "error";
  message: string;
  onRemove: (id: string) => void;
}

export default function Toast({ id, type, message, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return createPortal(
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>,
    document.body
  );
}