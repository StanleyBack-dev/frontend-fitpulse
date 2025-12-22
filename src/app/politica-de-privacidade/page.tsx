"use client";
import styles from "./politica-de-privacidade.module.css";

export default function PoliticaDePrivacidade() {
  return (
    <main className={styles.container}>
      
      <h1 className={styles.title}>Política de Privacidade</h1>

      <p className={styles.intro}>
        A sua privacidade é importante para nós. Esta política descreve como o{" "}
        <strong>PULSE</strong> coleta, usa e protege suas informações pessoais.
      </p>

      <section className={styles.section}>
        <h2>1. Informações Coletadas</h2>
        <blockquote>
          Podemos coletar informações como <strong>nome, e-mail e foto de perfil</strong> ao fazer
          login com o Google. Essas informações são usadas apenas para identificação dentro dos
          eventos e conexões da plataforma.
        </blockquote>
      </section>

      <section className={styles.section}>
        <h2>2. Uso das Informações</h2>
        <blockquote>
          Seus dados são utilizados exclusivamente para permitir conexões dentro de eventos,
          melhorar a experiência de uso e exibir perfis de forma contextualizada.
        </blockquote>
      </section>

      <section className={styles.section}>
        <h2>3. Segurança e Retenção</h2>
        <blockquote>
          Utilizamos medidas de segurança modernas para proteger suas informações. Você pode
          solicitar a exclusão de seus dados a qualquer momento.
        </blockquote>
      </section>

      <section className={styles.section}>
        <h2>4. Contato</h2>
        <blockquote>
          Em caso de dúvidas sobre esta política, entre em contato conosco através do e-mail:
          <a href="mailto:contact.pulseio@gmail.com"> contact.pulseio@gmail.com</a>.
        </blockquote>
      </section>

      <p className={styles.update}>Última atualização: Dezembro de 2025.</p>
    </main>
  );
}