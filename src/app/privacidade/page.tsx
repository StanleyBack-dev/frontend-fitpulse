"use client";

import { ShieldCheck, Lock, Eye, Database } from "lucide-react";
import styles from "./privacidade.module.css";

export default function PrivacyPolicy() {
  return (
    <main className={styles.container}>
      <div className={styles.blurCircle}></div>
      
      <div className={styles.contentCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Política de <span>Privacidade</span></h1>
          <p className={styles.lastUpdate}>Última atualização: Janeiro de 2026</p>
        </header>

        <section className={styles.intro}>
          <p>
            No <strong>FIT PULSE</strong>, a sua performance é privada. Entenda como protegemos seus dados biométricos e de saúde.
          </p>
        </section>

        <div className={styles.scrollArea}>
          <div className={styles.topic}>
            <div className={styles.topicHeader}>
              <Database className={styles.icon} size={24} />
              <h3>Dados Coletados</h3>
            </div>
            <p>
              Coletamos informações essenciais para o cálculo do seu IMC e previsões de saúde, como: 
              altura, peso, idade e histórico de atividades registradas.
            </p>
          </div>

          <div className={styles.topic}>
            <div className={styles.topicHeader}>
              <Eye className={styles.icon} size={24} />
              <h3>Uso das Informações</h3>
            </div>
            <p>
              Seus dados são processados localmente para gerar insights de evolução corporal. 
              Não compartilhamos suas métricas de saúde com anunciantes ou terceiros.
            </p>
          </div>

          <div className={styles.topic}>
            <div className={styles.topicHeader}>
              <Lock className={styles.icon} size={24} />
              <h3>Segurança de Dados</h3>
            </div>
            <p>
              Utilizamos criptografia de ponta a ponta em nossos servidores para garantir que 
              suas previsões futuras e dados de progresso fiquem inacessíveis para invasores.
            </p>
          </div>

          <div className={styles.topic}>
            <div className={styles.topicHeader}>
              <ShieldCheck className={styles.icon} size={24} />
              <h3>Seus Direitos</h3>
            </div>
            <p>
              Você pode solicitar a exclusão total da sua conta e de todo o seu histórico biométrico 
              a qualquer momento através das configurações do perfil.
            </p>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>Dúvidas sobre sua privacidade? Contate-nos em: <br /> 
            <strong>contact.fitpulseio@gmail.com</strong>
          </p>
        </footer>
      </div>
    </main>
  );
}