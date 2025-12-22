"use client";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import styles from "./termos-de-uso.module.css";

export default function TermosDeUso() {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <FiArrowLeft size={20} />
          Voltar
        </button>
      </header>

      <div className={styles.contentCard}>
        <h1 className={styles.title}>Termos de Uso</h1>

        <p className={styles.intro}>
          Bem-vindo ao <strong className={styles.highlight}>PULSE</strong>. Ao utilizar nossa plataforma, você concorda com os
          seguintes termos e condições. Leia atentamente antes de continuar.
        </p>

        <div className={styles.sectionsWrapper}>
          <section className={styles.section}>
            <h2>1. Uso da Plataforma</h2>
            <div className={styles.textBlock}>
              O PULSE é uma rede de networking ao vivo para eventos e conexões profissionais. Você se
              compromete a utilizar o aplicativo de forma ética, sem práticas abusivas, fraudulentas ou
              que violem leis vigentes.
            </div>
          </section>

          <section className={styles.section}>
            <h2>2. Conta e Autenticação</h2>
            <div className={styles.textBlock}>
              Ao se conectar com o Google, algumas informações básicas do seu perfil (como nome e e-mail)
              poderão ser utilizadas para personalizar sua experiência. Você pode encerrar sua conta a
              qualquer momento.
            </div>
          </section>

          <section className={styles.section}>
            <h2>3. Limitações de Responsabilidade</h2>
            <div className={styles.textBlock}>
              O PULSE não se responsabiliza por interações entre usuários fora da plataforma, nem por
              eventuais falhas técnicas temporárias. O uso do aplicativo é de responsabilidade exclusiva
              do usuário.
            </div>
          </section>
        </div>

        <p className={styles.update}>Última atualização: Dezembro de 2025.</p>
      </div>
    </main>
  );
}