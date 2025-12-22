"use client";
import styles from "./termos-de-uso.module.css";

export default function TermosDeUso() {
  return (
    <main className={styles.container}>

      <h1 className={styles.title}>Termos de Uso</h1>

      <p className={styles.intro}>
        Bem-vindo ao <strong>PULSE</strong>. Ao utilizar nossa plataforma, você concorda com os
        seguintes termos e condições. Leia atentamente antes de continuar.
      </p>

      <section className={styles.section}>
        <h2>1. Uso da Plataforma</h2>
        <blockquote>
          O PULSE é uma rede de networking ao vivo para eventos e conexões profissionais. Você se
          compromete a utilizar o aplicativo de forma ética, sem práticas abusivas, fraudulentas ou
          que violem leis vigentes.
        </blockquote>
      </section>

      <section className={styles.section}>
        <h2>2. Conta e Autenticação</h2>
        <blockquote>
          Ao se conectar com o Google, algumas informações básicas do seu perfil (como nome e e-mail)
          poderão ser utilizadas para personalizar sua experiência. Você pode encerrar sua conta a
          qualquer momento.
        </blockquote>
      </section>

      <section className={styles.section}>
        <h2>3. Limitações de Responsabilidade</h2>
        <blockquote>
          O PULSE não se responsabiliza por interações entre usuários fora da plataforma, nem por
          eventuais falhas técnicas temporárias. O uso do aplicativo é de responsabilidade exclusiva
          do usuário.
        </blockquote>
      </section>

      <p className={styles.update}>Última atualização: Dezembro de 2025.</p>
    </main>
  );
}