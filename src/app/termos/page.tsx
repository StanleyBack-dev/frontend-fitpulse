"use client";

import { Scale, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import styles from "./termos.module.css";

export default function TermsOfUse() {
  return (
    <main className={styles.container}>
      <div className={styles.blurCircle}></div>
      
      <div className={styles.contentCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Termos de <span>Uso</span></h1>
          <p className={styles.lastUpdate}>Vigente a partir de: Janeiro de 2026</p>
        </header>

        <section className={styles.intro}>
          <p>
            Ao utilizar o <strong>FIT PULSE</strong>, você concorda com as diretrizes de uso da nossa plataforma de análise de performance.
          </p>
        </section>

        <div className={styles.scrollArea}>
          <div className={styles.topic}>
            <div className={styles.topicHeader}>
              <Scale className={styles.icon} size={24} />
              <h3>Aceitação dos Termos</h3>
            </div>
            <p>
              Ao acessar o app, você confirma que tem capacidade legal e concorda em cumprir estes termos. O FIT PULSE reserva-se o direito de atualizar estas regras para melhorar a experiência do usuário.
            </p>
          </div>

          <div className={styles.topic}>
            <div className={styles.topicHeader}>
              <AlertTriangle className={styles.icon} size={24} />
              <h3>Aviso Médico</h3>
            </div>
            <p>
              Os cálculos de IMC e as previsões geradas são baseados em algoritmos estatísticos. O FIT PULSE <strong>não fornece diagnósticos médicos</strong>. Consulte sempre um profissional de saúde antes de iniciar dietas ou treinos intensos.
            </p>
          </div>

          <div className={styles.topic}>
            <div className={styles.topicHeader}>
              <Activity className={styles.icon} size={24} />
              <h3>Uso da Plataforma</h3>
            </div>
            <p>
              O usuário é responsável pela veracidade dos dados inseridos (peso, altura, idade). O uso indevido da plataforma para engenharia reversa ou atividades ilícitas resultará no banimento imediato da conta.
            </p>
          </div>

          <div className={styles.topic}>
            <div className={styles.topicHeader}>
              <CheckCircle2 className={styles.icon} size={24} />
              <h3>Limitação de Responsabilidade</h3>
            </div>
            <p>
              Não nos responsabilizamos por decisões tomadas com base nas projeções do app. O FIT PULSE é uma ferramenta de monitoramento e suporte à performance, não um garantidor de resultados físicos.
            </p>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>Dúvidas sobre nossas diretrizes? <br /> 
            <strong>contact.fitpulseio@gmail.com</strong>
          </p>
        </footer>
      </div>
    </main>
  );
}