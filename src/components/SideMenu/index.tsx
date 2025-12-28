"use client";

import React, { useState } from "react";
import styles from "./sidemenu.module.css";
import { 
  Menu, X, User, Calendar, Settings, 
  LogOut, Map, Bell 
} from "lucide-react";

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Exemplo de itens do menu
  const menuItems = [
    { icon: User, label: "Meu Perfil", action: () => console.log("Perfil") },
    { icon: Calendar, label: "Meus Eventos", action: () => console.log("Eventos") },
    { icon: Bell, label: "Notificações", action: () => console.log("Notificações") },
    { icon: Settings, label: "Configurações", action: () => console.log("Config") },
  ];

  return (
    <>
      {/* Botão de Toggle (Sempre visível) */}
      <button 
        className={styles.toggleBtn} 
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Container Overlay */}
      <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`}>
        
        {/* Fundo escuro (clicar fecha o menu) */}
        <div className={styles.backdrop} onClick={toggleMenu} />

        {/* O Menu Lateral */}
        <nav className={styles.panel}>
          
          {/* Cabeçalho do Usuário */}
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>SR</div> {/* Iniciais */}
              <div>
                <div className={styles.userName}>Stanley Rodrigues</div>
                <div className={styles.userRole}>Desenvolvedor</div>
              </div>
            </div>
          </div>

          {/* Links de Navegação */}
          <div className={styles.nav}>
            {menuItems.map((item, index) => (
              <div key={index} className={styles.navItem} onClick={item.action}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Rodapé / Logout */}
          <div className={styles.footer}>
            <button className={styles.logoutBtn}>
              <LogOut size={20} />
              <span>Sair do App</span>
            </button>
          </div>

        </nav>
      </div>
    </>
  );
}