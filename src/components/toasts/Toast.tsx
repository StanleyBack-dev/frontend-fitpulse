"use client";

import { useEffect, useState } from "react";
import styles from "./toast.module.css";
import { X } from "lucide-react";

interface ToastProps {
  id: string;
  type: "success" | "error";
  message: string;
  onRemove: (id: string) => void;
}

export default function Toast({ id, type, message, onRemove }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  const handleRemove = () => {
    setExiting(true);
    setTimeout(() => {
      onRemove(id);
    }, 350);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRemove();
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${
        exiting ? styles["toast-exit"] : ""
      }`}
    >
      <span>{message}</span>
      <button 
        onClick={handleRemove}
        style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}