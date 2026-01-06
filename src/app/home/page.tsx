"use client";

import styles from "./home.module.css";
import Header from "./components/header/header";
import Card from "./components/card/card";
import Menu from "./components/menu/menu";
import { Home, BarChart2, Settings, User as UserIcon } from "lucide-react";
import { useLastIMC } from "./hooks/useLastIMC";
import { useMyUser } from "./hooks/useMyUsers";
import Link from "next/link";

export default function HomePage() {
  const imcData = useLastIMC();
  const { user, loading } = useMyUser();

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <Header
          userName={loading ? "Carregando..." : user?.name || "Usuário"}
          userAvatar={user?.urlAvatar}
        />

        <Card imc={imcData?.bmi} category={imcData?.bmiStatus} />

        <h4 className={styles.sectionTitle}>Ações Rápidas</h4>
        <Menu />

        <section className={styles.tipCard}>
          <h5 className={styles.tipTitle}>Dica do dia 💡</h5>
          <p className={styles.tipText}>
            Beber 500ml de água agora ajuda no seu metabolismo.
          </p>
        </section>
      </div>

      <nav className={styles.bottomNav}>
        <button className={styles.navItemActive}>
          <Home size={20} />
          <span>Home</span>
        </button>
        <button className={styles.navItem}>
          <BarChart2 size={20} />
          <span>Dados</span>
        </button>
        <button className={styles.navItem}>
          <UserIcon size={20} />
          <span>Perfil</span>
        </button>
        <Link href="/ajustes" className={styles.navItem}>
          <Settings size={20} />
          <span>Ajustes</span>
        </Link>
      </nav>
    </main>
  );
}