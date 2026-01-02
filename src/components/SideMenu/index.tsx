"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./sidemenu.module.css";
import { 
  Menu, X, User, Calendar, Settings, 
  LogOut, Bell 
} from "lucide-react";

// Services
import { logoutSession } from "../../services/auth/logout/authLogoutService"; 
import { getMyUser, UserProfile } from "../../services/users/get/userGetService";

export default function SideMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Estado para os dados do usuário
  const [userData, setUserData] = useState<UserProfile | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // --- BUSCAR DADOS DO USUÁRIO ---
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const profile = await getMyUser();
      if (isMounted && profile) {
        setUserData(profile);
      }
    };

    // Só busca se o menu estiver aberto (performance) OU busca logo ao montar (preferência)
    // Aqui vou buscar ao montar para garantir que os dados estejam lá
    fetchUser();

    return () => { isMounted = false; };
  }, []);

  // --- LÓGICA DE AVATAR (Iniciais) ---
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutSession();
    setIsLoggingOut(false);
    window.location.href = '/';
  };

  const menuItems = [
    { icon: User, label: "Meu Perfil", action: () => router.push('/profile') },
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
              
              {/* LÓGICA DE EXIBIÇÃO DO AVATAR */}
              <div className={styles.avatar}>
                {userData?.urlAvatar ? (
                  <img src={userData.urlAvatar} alt="Avatar" className={styles.avatarImg} />
                ) : (
                  <span>{userData ? getInitials(userData.name) : "..."}</span>
                )}
              </div>
              
              <div>
                {/* DADOS DINÂMICOS */}
                <div className={styles.userName}>
                    {userData ? userData.name : "Carregando..."}
                </div>
                <div className={styles.userRole}>
                    {userData?.email || "Usuário"}
                </div>
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