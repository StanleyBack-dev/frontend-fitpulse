"use client";

import { useState, useEffect } from "react";
import { Chrome, X } from "lucide-react";
import styles from "./browser.module.css";

export default function BrowserModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("hasSeenBrowserModal");
    const userAgent = navigator.userAgent;
    const isGenericBrowser = /SamsungBrowser|Version\/.*Chrome|Version\/.*Safari|Instagram|FBAN|FBAV/i.test(userAgent);

    if (!hasSeenModal && isGenericBrowser) {
      const timer = setTimeout(() => setIsVisible(true));
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenChrome = () => {
    const currentUrl = window.location.href;
    
    const rawUrl = currentUrl.replace(/^https?:\/\//, "");

    const intentUrl = `intent://${rawUrl}#Intent;scheme=https;package=com.android.chrome;end`;

    const iosChromeUrl = `googlechrome://${rawUrl}`;

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      window.location.href = intentUrl;
    } else if (isIOS) {

      window.location.href = iosChromeUrl;
      setTimeout(() => {
        alert("Certifique-se de que o Google Chrome está instalado no seu iPhone.");
      }, 1500);
    } else {

      window.open(currentUrl, "_blank");
    }
    
    handleClose();
  };

  const handleClose = () => {
    sessionStorage.setItem("hasSeenBrowserModal", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.dragHandle}></div>
        
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <div className={styles.iconWrapper}>
          <Chrome size={40} color="#adff2f" />
        </div>

        <h3 className={styles.title}>Performance Otimizada</h3>
        <p className={styles.description}>
          Para uma experiência fluida com gráficos e cálculos em tempo real, 
          recomendamos utilizar o <strong>Google Chrome</strong>.
        </p>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn} onClick={handleOpenChrome}>
            <Chrome size={18} />
            ABRIR NO CHROME
          </button>
          <button className={styles.secondaryBtn} onClick={handleClose}>
            CONTINUAR NESTE NAVEGADOR
          </button>
        </div>
      </div>
    </div>
  );
}