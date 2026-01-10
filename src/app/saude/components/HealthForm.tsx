"use client";

import { useState, useEffect } from "react";
import { Ruler, Weight, FileText, Calendar, Calculator, Save } from "lucide-react";
import styles from "./HealthForm.module.css";
import { useCreateHealth } from "../hooks/useCreateHealth";
import { useToast } from "../../../components/toasts/ToastProvider";
import { useLoading } from "../../../components/screens/loading.context";
import { getBmiStatus } from "../../../utils/getBmiStatus";
import { sanitizeObservation } from "../../../utils/inputFormt.util";
import { decimalMask, parseFormattedToNumber } from "../../../utils/mask.util";

export default function HealthForm() {
  const { createHealth, loading } = useCreateHealth();
  const { showSuccess, showError } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [formData, setFormData] = useState({
    heightCm: "",
    weightKg: "",
    bmi: "",
    bmiStatus: "",
    observation: "",
    measurementDate: new Date().toISOString().slice(0, 10),
  });

  // Cálculo automático do IMC
  useEffect(() => {
    // Converte "1,80" -> 1.80 e "80,50" -> 80.50 para conta
    const heightMeters = parseFormattedToNumber(formData.heightCm); 
    const weight = parseFormattedToNumber(formData.weightKg);

    if (heightMeters > 0 && weight > 0) {
      const bmi = weight / Math.pow(heightMeters, 2);
      setFormData((prev) => ({
        ...prev,
        bmi: bmi.toFixed(2).replace('.', ','), // Mostra bonito no input readonly
        bmiStatus: getBmiStatus(bmi),
      }));
    } else {
      setFormData((prev) => ({ ...prev, bmi: "", bmiStatus: "" }));
    }
  }, [formData.heightCm, formData.weightKg]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  showLoading("Registrando dados de saúde...");

  const rawWeight = parseFormattedToNumber(formData.weightKg);
  const rawHeightMeters = parseFormattedToNumber(formData.heightCm);
  const heightInCm = Math.round(rawHeightMeters * 100);

  try {
    const result = await createHealth({
      heightCm: heightInCm,
      weightKg: rawWeight,
      observation: formData.observation || undefined,
      measurementDate: formData.measurementDate,
    });

    hideLoading();

    if (result) {
      showSuccess("Registro de saúde criado com sucesso!");
      setFormData({
        heightCm: "",
        weightKg: "",
        bmi: "",
        bmiStatus: "",
        observation: "",
        measurementDate: new Date().toISOString().slice(0, 10),
      });
    } else {
      showError("Não foi possível criar o registro de saúde.");
    }
  } catch (err: any) {
    hideLoading();
    showError(err.message || "Erro inesperado ao registrar saúde.");
  }
};


  return (
    <form className={styles.content} onSubmit={handleSubmit}>
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Medição Corporal</h3>
        <div className={styles.card}>
          
          {/* CAMPO DE PESO */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Weight size={20} />
              </span>
              <span className={styles.label}>Peso (kg)</span>
            </div>
            <input
              type="text" // Use Text para permitir vírgulas
              inputMode="numeric" // Teclado numérico no mobile
              className={styles.inputInline}
              placeholder="0,00"
              value={formData.weightKg}
              onChange={(e) => {
                // Aplica a máscara estilo bancário (2 casas decimais)
                const { formatted } = decimalMask(e.target.value, 2);
                setFormData({ ...formData, weightKg: formatted });
              }}
            />
          </div>

          <div className={styles.divider} />

          {/* CAMPO DE ALTURA */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Ruler size={20} />
              </span>
              <span className={styles.label}>Altura (m)</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              className={styles.inputInline}
              placeholder="0,00" // Placeholder sugere formato metros
              value={formData.heightCm}
              onChange={(e) => {
                // Máscara com 2 casas para simular Metros (ex: 1,80)
                const { formatted } = decimalMask(e.target.value, 2);
                setFormData({ ...formData, heightCm: formatted });
              }}
            />
          </div>

          <div className={styles.divider} />

          {/* IMC (ReadOnly) */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Calculator size={20} />
              </span>
              <span className={styles.label}>IMC</span>
            </div>
            <input
              type="text"
              readOnly
              className={`${styles.inputInline} ${styles.readonlyField}`}
              value={formData.bmi}
              placeholder="Calculado"
            />
          </div>

          <div className={styles.divider} />

          {/* Status (ReadOnly) */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <FileText size={20} />
              </span>
              <span className={styles.label}>Status</span>
            </div>
            <input
              type="text"
              readOnly
              className={`${styles.inputInline} ${styles.readonlyField}`}
              value={formData.bmiStatus}
              placeholder="Automático"
            />
          </div>

          <div className={styles.divider} />

          {/* Data */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Calendar size={20} />
              </span>
              <span className={styles.label}>Data da Medição</span>
            </div>
            <input
              type="date"
              className={styles.inputDate}
              value={formData.measurementDate}
              onChange={(e) =>
                setFormData({ ...formData, measurementDate: e.target.value })
              }
            />
          </div>
        </div>
      </section>

      {/* Observações */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Observações</h3>
        <div className={styles.card}>
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <FileText size={20} />
              </span>
              <textarea
                className={styles.textareaField}
                placeholder="Ex: Medição feita pela manhã..."
                value={formData.observation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    observation: sanitizeObservation(e.target.value, 200),
                  })
                }
              />
            </div>
          </div>
        </div>
      </section>

      <button type="submit" className={styles.saveBtn} disabled={loading}>
        {!loading && (
          <>
            <Save size={20} /> Salvar Medição
          </>
        )}
      </button>
    </form>
  );
}