import styles from "./loading.module.css";

interface LoadingScreenProps {
  visible: boolean;
  message?: string;
}

export default function LoadingScreen({ visible, message = "Carregando..." }: LoadingScreenProps) {
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
}