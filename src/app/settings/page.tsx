"use client";

import Link from "next/link";
import { 
  ChevronRight, 
  User, 
  Bell, 
  ShieldCheck, 
  Scale, 
  LogOut, 
  ArrowLeft 
} from "lucide-react";
import styles from "./settings.module.css";
import LogoutButton from "../../components/buttons/logout/logout.button";

export default function SettingsPage() {
  const settingsGroups = [
    {
      title: "Conta",
      items: [
        { icon: <User size={20} />, label: "Perfil do Usuário", link: "/profile" },
        { icon: <Scale size={20} />, label: "Unidades de Medida", detail: "kg, cm" },
      ]
    },
    {
      title: "Segurança e Legal",
      items: [
        { icon: <ShieldCheck size={20} />, label: "Privacidade", link: "/privacidade" },
        { icon: <ShieldCheck size={20} />, label: "Termos de Uso", link: "/termos" },
        { icon: <Bell size={20} />, label: "Notificações", detail: "Ativadas" },
      ]
    }
  ];

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/home" className={styles.backBtn}>
          <ArrowLeft size={24} />
        </Link>
        <h1 className={styles.title}>Ajustes</h1>
      </header>

      <div className={styles.content}>
        {settingsGroups.map((group, idx) => (
          <section key={idx} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <div className={styles.card}>
              {group.items.map((item, i) => (
                <div key={i} className={styles.itemWrapper}>
                   {item.link ? (
                     <Link href={item.link} className={styles.item}>
                        <div className={styles.itemLeft}>
                          <span className={styles.icon}>{item.icon}</span>
                          <span className={styles.label}>{item.label}</span>
                        </div>
                        <ChevronRight size={18} className={styles.chevron} />
                     </Link>
                   ) : (
                     <div className={styles.item}>
                        <div className={styles.itemLeft}>
                          <span className={styles.icon}>{item.icon}</span>
                          <span className={styles.label}>{item.label}</span>
                        </div>
                        <span className={styles.detail}>{item.detail}</span>
                     </div>
                   )}
                   {i < group.items.length - 1 && <div className={styles.divider} />}
                </div>
              ))}
            </div>
          </section>
        ))}

        <LogoutButton />

        <p className={styles.version}>FIT PULSE v1.0.0</p>
      </div>
    </main>
  );
}