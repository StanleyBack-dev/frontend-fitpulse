import { X } from "lucide-react";
import styles from "./oms-modal.module.css";

interface OMSTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OMSTableModal({ isOpen, onClose }: OMSTableModalProps) {
  if (!isOpen) return null;

  const omsTable = [
    { range: "< 18.5", label: "Abaixo do peso", color: "#00d1ff" },
    { range: "18.5 - 24.9", label: "Peso Ideal", color: "#adff2f" },
    { range: "25.0 - 29.9", label: "Sobrepeso", color: "#ffcc00" },
    { range: "30.0 - 34.9", label: "Obesidade Grau I", color: "#ff8800" },
    { range: "35.0 - 39.9", label: "Obesidade Grau II", color: "#ff4400" },
    { range: "> 40.0", label: "Obesidade Grau III", color: "#ff0000" },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Classificação OMS</h3>
          <button onClick={onClose} aria-label="Fechar"><X size={20}/></button>
        </div>
        <div className={styles.tableList}>
          {omsTable.map((item, index) => (
            <div key={index} className={styles.tableRow}>
              <span className={styles.rangeText}>{item.range}</span>
              <span className={styles.labelColor} style={{ color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}