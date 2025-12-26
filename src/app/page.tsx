"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuthRedirect } from "@/app/hooks/useAuth";
import LoginButton from "@/app/components/LoginButton";
import styles from "./page.module.css";

export default function Login() {
  // Chamada do hook que verifica a sessão
  const { isLoading } = useAuthRedirect();

  const [index, setIndex] = useState(0);
  const slides = [
    "O futuro do networking está aqui 🚀",
    "Cada conexão começa com um pulso 💜",
    "Conecte. Explore. Cresça. 🌐",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Enquanto estiver verificando se o usuário está logado, 
  // não mostramos nada (ou um spinner) para evitar o flash da tela de login
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#000',
        color: '#fff' 
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <Image 
          src="/logo-pulse.png" 
          alt="Logo PULSE" 
          width={180} 
          height={180} 
          priority 
          className={styles.logo} 
        />
        
        <div className={styles.textGroup}>
          <h1 className={styles.title}>Conecte-se ao PULSE</h1>
          <div className={styles.sliderWrapper}>
            <div 
              className={styles.slider} 
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((text, i) => (
                <div key={i} className={styles.slide}>{text}</div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <LoginButton />
          <button 
            className={styles.guestBtn} 
            onClick={() => (window.location.href = "/profile")}
          >
            Apenas Entrar
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.termsText}>
          Ao continuar, você concorda com os{" "}
          <a href="/termos-de-uso" className={styles.link}>Termos de Uso</a> e a{" "}
          <a href="/politica-de-privacidade" className={styles.link}>Política de Privacidade</a>.
        </p>
      </footer>
    </main>
  );
}