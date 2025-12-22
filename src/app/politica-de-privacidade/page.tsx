"use client";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import styles from "./politica-de-privacidade.module.css";

export default function PoliticaDePrivacidade() {
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
        <h1 className={styles.title}>Política de Privacidade</h1>

        <p className={styles.intro}>
          A sua privacidade é importante para nós. Esta política descreve como o{" "}
          <strong className={styles.highlight}>PULSE</strong> coleta, usa e protege suas informações pessoais.
        </p>

        <div className={styles.sectionsWrapper}>
          <section className={styles.section}>
            <h2>1. Informações Coletadas</h2>
            <div className={styles.textBlock}>
              Podemos coletar informações como <strong>nome, e-mail e foto de perfil</strong> ao fazer
              login com o Google. Essas informações são usadas apenas para identificação dentro dos
              eventos e conexões da plataforma.
            </div>
          </section>

          <section className={styles.section}>
            <h2>2. Uso das Informações</h2>
            <div className={styles.textBlock}>
              Seus dados são utilizados exclusivamente para permitir conexões dentro de eventos,
              melhorar a experiência de uso e exibir perfis de forma contextualizada.
            </div>
          </section>

          <section className={styles.section}>
            <h2>3. Segurança e Retenção</h2>
            <div className={styles.textBlock}>
              Utilizamos medidas de segurança modernas para proteger suas informações. Você pode
              solicitar a exclusão de seus dados a qualquer momento.
            </div>
          </section>

          <section className={styles.section}>
            <h2>4. Contato</h2>
            <div className={styles.textBlock}>
              Em caso de dúvidas sobre esta política, entre em contato conosco através do e-mail:
              <a href="mailto:contact.pulseio@gmail.com" className={styles.mailLink}> contact.pulseio@gmail.com</a>.
            </div>
          </section>
        </div>

        <p className={styles.update}>Última atualização: Dezembro de 2025.</p>
      </div>
    </main>
  );
}