import styles from "./loading.module.css";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
}