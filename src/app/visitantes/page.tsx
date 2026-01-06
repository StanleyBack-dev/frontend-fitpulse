"use client";

import { useState, useEffect } from "react";
import { Activity, UserPlus, TableProperties, HeartPulse } from "lucide-react";
import { calculateIMC, IMCCalculationResult } from "./utils/healthCalculations.util";
import OMSTableModal from "./components/modal/oms.modal";
import styles from "./visitors.module.css";

export default function Visitors() {
  const [formData, setFormData] = useState({
    heightCm: 170,
    weightKg: 70,
    age: 25,
    sex: 'male' as 'male' | 'female',
  });

  const [result, setResult] = useState<IMCCalculationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "Acompanhe sua evolução semanal",
    "Gráficos detalhados de bioimpedância",
    "Metas de saúde baseadas no seu perfil"
  ];

  useEffect(() => {
    const res = calculateIMC(formData.heightCm, formData.weightKg, formData.age, formData.sex);
    setResult(res);
  }, [formData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const getIndicatorPosition = () => {
    if (!result) return "0%";
    const pos = (result.imc - 10) * 2.8; 
    return `${Math.min(Math.max(pos, 0), 100)}%`;
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}><HeartPulse size={28} color="#adff2f" /></div>
          <h1 className={styles.mainTitle}>FIT<span>PULSE</span></h1>
        </div>
        <div className={styles.sliderContainer}>
          <p className={styles.slideText} key={currentSlide}>{slides[currentSlide]}</p>
        </div>
        <button className={styles.tableToggle} onClick={() => setIsModalOpen(true)}>
          <TableProperties size={14} /> Classificação OMS
        </button>
      </header>

      <div className={styles.grid}>
        <section className={styles.inputCard}>
          <h2 className={styles.sectionTitle}><Activity size={16}/> Parâmetros</h2>
          
          <div className={styles.inputGroup}>
            <label>Altura: <strong>{formData.heightCm} cm</strong></label>
            <input type="range" min="50" max="230" className={styles.rangeInput}
              value={formData.heightCm}
              onChange={(e) => setFormData({...formData, heightCm: Number(e.target.value)})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Peso: <strong>{formData.weightKg} kg</strong></label>
            <input type="range" min="5" max="200" className={styles.rangeInput}
              value={formData.weightKg}
              onChange={(e) => setFormData({...formData, weightKg: Number(e.target.value)})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Idade: <strong>{formData.age} anos</strong></label>
            <input type="range" min="2" max="100" className={styles.rangeInput}
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
            />
          </div>

          <div className={styles.selectorGroup}>
            <button className={formData.sex === 'male' ? styles.activeSelect : styles.selectBtn}
              onClick={() => setFormData({...formData, sex: 'male'})}>Masculino</button>
            <button className={formData.sex === 'female' ? styles.activeSelect : styles.selectBtn}
              onClick={() => setFormData({...formData, sex: 'female'})}>Feminino</button>
          </div>
        </section>

        <section className={styles.resultCard}>
          <div className={styles.imcHeader}>
            <span>Índice de Massa Corporal</span>
            <h3 style={{ color: result?.color }}>{result?.imc || "--"}</h3>
          </div>

          <div className={styles.gaugeContainer}>
             <div className={styles.gaugeBar}>
                <div className={styles.gaugeIndicator} 
                  style={{ left: getIndicatorPosition(), backgroundColor: result?.color || "#333" }} />
             </div>
             <div className={styles.gaugeLabels}>
                <span>10</span><span>18.5</span><span>25</span><span>30</span><span>45</span>
             </div>
          </div>

          <div className={styles.infoBox} style={{ borderColor: result?.color || "#333" }}>
             <h4 style={{ color: result?.color }}>{result?.category}</h4>
             <p>Sugestão p/ idade: <strong>{result?.idealWeight}</strong>.</p>
          </div>

          <div className={styles.divider} />

          <button className={styles.ctaBtn} onClick={() => window.location.href = "/"}>
             <span>Criar conta para salvar</span><UserPlus size={18}/>
          </button>
          {formData.age < 20 && (
            <p className={styles.childNote}>* Avaliação baseada em curvas de crescimento infantil.</p>
          )}
        </section>
      </div>
      <OMSTableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}