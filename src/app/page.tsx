"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuthRedirect } from "@/hooks/auth/useAuth";
import LoginButton from "../components/buttons/login/login.button";
import LoadingScreen from "../components/screens/loading.screen";
import BrowserModal from "../components/modals/browser.modal";
import styles from "./page.module.css";

export default function Login() {
  const { isLoading } = useAuthRedirect();
  const [index, setIndex] = useState(0);
  
  const slides = [
    "Calcule seu IMC em segundos ⚡",
    "Previsões reais para sua evolução 📈",
    "Transforme dados em resultados 🔥",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (isLoading) {
    return <LoadingScreen message="Sincronizando seus dados vitais..." />;
  }

  return (
    <main className={styles.container}>
      <BrowserModal />
      <div className={styles.blurCircle1}></div>
      <div className={styles.blurCircle2}></div>

      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logoBadge}>
            <Image 
              src="/logo-fitpulse.png" 
              alt="FIT PULSE" 
              width={110} 
              height={110} 
              priority 
              className={styles.logo} 
            />
          </div>
          <h1 className={styles.brandName}>FIT<span>PULSE</span></h1>
          <p className={styles.tagline}>Análises de saúde inteligentes</p>
        </header>
        
        <div className={styles.sliderContainer}>
          <div 
            className={styles.sliderTrack} 
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((text, i) => (
              <div key={i} className={styles.slideItem}>
                <span className={styles.slideText}>{text}</span>
              </div>
            ))}
          </div>
          <div className={styles.indicators}>
            {slides.map((_, i) => (
              <div key={i} className={`${styles.dot} ${index === i ? styles.activeDot : ""}`}></div>
            ))}
          </div>
        </div>

        <div className={styles.actionArea}>
          <div className={styles.googleWrapper}>
            <LoginButton />
          </div>

          <div className={styles.divider}>
            <span>ou continue como</span>
          </div>

          <button 
            className={styles.secondaryBtn} 
            onClick={() => (window.location.href = "/visitors")}
          >
            Entrar como Visitante
          </button>
        </div>

        <footer className={styles.footer}>
          <p>
            Ao entrar, aceita os nossos <br />
            <a href="/termos">Termos de Uso</a> e <a href="/privacidade">Privacidade</a>
          </p>
        </footer>
      </div>
    </main>
  );
}