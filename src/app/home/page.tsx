"use client";

import { useEffect } from "react";
import styles from "./home.module.css";
import Header from "./components/header/header";
import Card from "./components/card/card";
import Menu from "./components/menu/menu";
import TipsCarousel from "./components/tips/TipsCarousel";
import { 
  Home, BarChart2, Settings, User as UserIcon, 
  Activity, Weight, Target, Utensils, TrendingUp, TrendingDown, Minus, 
  History
} from "lucide-react";
import Link from "next/link";
import { useLastIMC } from "./hooks/useLastIMC";
import { useMyUser } from "./hooks/useMyUsers";
import { useLoading } from "../../components/screens/loading.context";

export default function HomePage() {
  const { data: health, loading: loadingIMC } = useLastIMC();
  const { user, loading: loadingUser } = useMyUser();
  const { showLoading, hideLoading } = useLoading();

  const isLoading = loadingIMC || loadingUser;

  useEffect(() => {
    if (isLoading) showLoading("Calculando métricas...");
    else hideLoading();
  }, [isLoading, showLoading, hideLoading]);

  if (isLoading) return null;

  const isOverweight = health?.weightKg && health.weightKg > health.idealMaxWeight;
  const targetWeight = isOverweight ? health?.idealMaxWeight : health?.idealMinWeight;
  
  const EvolutionIcon = health?.weightDirection === "lost" ? TrendingDown : health?.weightDirection === "gained" ? TrendingUp : Minus;
  const evolutionColor = health?.weightDirection === "lost" ? "#adff2f" : health?.weightDirection === "gained" ? "#ff4545" : "#888";
  const evolutionLabel = health?.weightDirection === "lost" ? "Você perdeu" : health?.weightDirection === "gained" ? "Você ganhou" : "Manteve";

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <Header userName={user?.name} userAvatar={user?.urlAvatar} />

        <div className={styles.cardsSlider}>
            
            <Card 
                label="IMC Atual" 
                value={health?.bmi?.toFixed(1) || "-"} 
                subtext={health?.bmiStatus} 
                Icon={Activity} 
                color="#adff2f" 
            />

            <Card 
                label="Peso Atual" 
                value={health?.weightKg?.toFixed(1) || "-"} 
                unit="kg" 
                Icon={Weight} 
                color="#00d9ff" 
            />

            <Card 
                label={evolutionLabel} 
                value={health?.weightChange?.toFixed(1) || "0"} 
                unit="kg" 
                subtext="Desde a última vez" 
                Icon={EvolutionIcon} 
                color={evolutionColor} 
            />

            {health?.previousWeightKg && (
                <Card 
                    label="Peso Anterior" 
                    value={health.previousWeightKg.toFixed(1)} 
                    unit="kg" 
                    subtext="Registro passado" 
                    Icon={History} 
                    color="#aaa"
                />
            )}

            <Card 
                label="Peso Ideal" 
                value={targetWeight?.toFixed(1) || "-"} 
                unit="kg" 
                subtext={isOverweight ? "Meta Máxima" : "Meta Mínima"} 
                Icon={Target} 
                color="#ff00ff"
            />

            <Card 
                label="Proteína Diária" 
                value={health?.proteinGoal?.toFixed(0) || "-"} 
                unit="g" 
                subtext="Meta" 
                Icon={Utensils} 
                color="#ff8c00" 
            />
        </div>

        <h4 className={styles.sectionTitle}>Ações Rápidas</h4>
        <Menu />
        
        <TipsCarousel data={health} />

      </div>

      <nav className={styles.bottomNav}>
         <button className={styles.navItemActive}><Home size={20} /><span>Home</span></button>
         <button className={styles.navItem}><BarChart2 size={20} /><span>Dados</span></button>
         <Link href="/perfil" className={styles.navItem}><UserIcon size={20} /><span>Perfil</span></Link>
         <Link href="/ajustes" className={styles.navItem}><Settings size={20} /><span>Ajustes</span></Link>
      </nav>
    </main>
  );
}