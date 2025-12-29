"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./sidemenu.module.css";
import { 
  Menu, X, User, Calendar, Settings, 
  LogOut, Map, Bell 
} from "lucide-react";
import { logoutSession } from "../../services/authService"; 

export default function SideMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // --- LÓGICA DE LOGOUT ---
  const handleLogout = async () => {
    setIsLoggingOut(true);

    // 1. Chama o backend para limpar o cookie HTTP-Only
    await logoutSession();

    // 3. Redireciona
    setIsLoggingOut(false);
    window.location.href = '/';
  };

  const menuItems = [
    { icon: User, label: "Meu Perfil", action: () => console.log("Perfil") },
    { icon: Calendar, label: "Meus Eventos", action: () => console.log("Eventos") },
    { icon: Bell, label: "Notificações", action: () => console.log("Notificações") },
    { icon: Settings, label: "Configurações", action: () => console.log("Config") },
  ];

  return (
    <>
      <button 
        className={styles.toggleBtn} 
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`}>
        
        <div className={styles.backdrop} onClick={toggleMenu} />

        <nav className={styles.panel}>
          
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>SR</div>
              <div>
                <div className={styles.userName}>Stanley Rodrigues</div>
                <div className={styles.userRole}>Desenvolvedor</div>
              </div>
            </div>
          </div>

          <div className={styles.nav}>
            {menuItems.map((item, index) => (
              <div key={index} className={styles.navItem} onClick={item.action}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <button 
                className={styles.logoutBtn} 
                onClick={handleLogout}
                disabled={isLoggingOut}
            >
              <LogOut size={20} />
              <span>{isLoggingOut ? "Saindo..." : "Sair do App"}</span>
            </button>
          </div>

        </nav>
      </div>
    </>
  );
}