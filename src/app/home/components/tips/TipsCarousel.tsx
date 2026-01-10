import { useEffect, useState } from "react";
import styles from "./tips.module.css";
import { Droplets, Utensils, Flame, Activity } from "lucide-react";
import { HealthInsights } from "../../../../utils/health-calculator.util";

interface TipsCarouselProps {
  data: HealthInsights | null;
}

export default function TipsCarousel({ data }: TipsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const water = data?.waterGoal?.toFixed(1) || "0";
  const protein = data?.proteinGoal?.toFixed(0) || "0";
  const calories = data?.basalCalories?.toFixed(0) || "0";
  const weight = data?.weightKg?.toFixed(1) || "0";

  const tips = [
    {
      id: 1,
      icon: Droplets,
      color: "#00d9ff",
      title: "Hidratação",
      content: (
        <>
          Com seu peso atual, sua meta é beber <span className={styles.highlight}>{water} Litros</span> de água por dia. Beba um copo agora!
        </>
      ),
    },
    {
      id: 2,
      icon: Utensils,
      color: "#ff8c00",
      title: "Construção Muscular",
      content: (
        <>
          Para manter sua massa magra, tente consumir cerca de <span className={styles.highlight}>{protein}g</span> de proteína hoje.
        </>
      ),
    },
    {
      id: 3,
      icon: Flame,
      color: "#ff4545",
      title: "Gasto Calórico",
      content: (
        <>
          Seu corpo gasta aproximadamente <span className={styles.highlight}>{calories} kcal</span> apenas para se manter vivo (TMB).
        </>
      ),
    },
    {
      id: 4,
      icon: Activity,
      color: "#adff2f",
      title: "Dica de Treino",
      content: (
        <>
          Você está pesando <span className={styles.highlight}>{weight}kg</span>. Caminhadas leves de 30min ajudam a regular seu cardio.
        </>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === tips.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className={styles.carouselContainer}>
      <div 
        className={styles.track} 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {tips.map((tip) => (
          <div key={tip.id} className={styles.slide}>
            <div className={styles.header}>
              <div className={styles.iconWrapper} style={{ backgroundColor: `${tip.color}20` }}>
                <tip.icon size={18} color={tip.color} />
              </div>
              <span className={styles.title} style={{ color: tip.color }}>
                {tip.title}
              </span>
            </div>
            <p className={styles.text}>{tip.content}</p>
          </div>
        ))}
      </div>

      <div className={styles.indicators}>
        {tips.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
}