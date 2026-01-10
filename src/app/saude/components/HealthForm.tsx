"use client";

import { useState, useEffect } from "react";
import {
  Ruler,
  Weight,
  FileText,
  Calendar,
  Calculator,
  Save,
  Activity,
} from "lucide-react";
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
    const heightMeters = parseFormattedToNumber(formData.heightCm);
    const weight = parseFormattedToNumber(formData.weightKg);

    if (heightMeters > 0 && weight > 0) {
      const bmi = weight / Math.pow(heightMeters, 2);
      setFormData((prev) => ({
        ...prev,
        bmi: bmi.toFixed(2).replace(".", ","),
        bmiStatus: getBmiStatus(bmi),
      }));
    } else {
      setFormData((prev) => ({ ...prev, bmi: "", bmiStatus: "" }));
    }
  }, [formData.heightCm, formData.weightKg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Registrando...");

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
        showSuccess("Medição salva!");
        setFormData({
          heightCm: "",
          weightKg: "",
          bmi: "",
          bmiStatus: "",
          observation: "",
          measurementDate: new Date().toISOString().slice(0, 10),
        });
      } else {
        showError("Erro ao salvar medição.");
      }
    } catch (err: any) {
      hideLoading();
      showError(err.message || "Erro inesperado.");
    }
  };

  return (
    <form className={styles.content} onSubmit={handleSubmit}>
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Medidas</h3>
        <div className={styles.card}>
          {/* PESO */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Weight size={20} />
              </span>
              <span className={styles.label}>Peso (kg)</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              className={styles.inputInline}
              placeholder="0,00"
              value={formData.weightKg}
              onChange={(e) => {
                const { formatted } = decimalMask(e.target.value, 2);
                setFormData({ ...formData, weightKg: formatted });
              }}
            />
          </div>

          <div className={styles.divider} />

          {/* ALTURA */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Ruler size={20} />
              </span>
              <span className={styles.label}>Altura (m)</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              className={styles.inputInline}
              placeholder="0,00"
              value={formData.heightCm}
              onChange={(e) => {
                const { formatted } = decimalMask(e.target.value, 2);
                setFormData({ ...formData, heightCm: formatted });
              }}
            />
          </div>

          <div className={styles.divider} />

          {/* IMC (Calculado) */}
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
              placeholder="-"
            />
          </div>

          <div className={styles.divider} />

          {/* STATUS (Calculado) */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Activity size={20} />
              </span>
              <span className={styles.label}>Status</span>
            </div>

            {/* AQUI: Trocamos o Input pela Div Badge */}
            <div className={styles.statusBadge}>
              {formData.bmiStatus || "-"}
            </div>
          </div>

          <div className={styles.divider} />

          {/* DATA */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Calendar size={20} />
              </span>
              <span className={styles.label}>Data</span>
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
        <h3 className={styles.groupTitle}>Notas</h3>
        <div className={styles.card}>
          <div className={styles.item} style={{ alignItems: "flex-start" }}>
            <span className={styles.icon} style={{ marginTop: "12px" }}>
              <FileText size={20} />
            </span>
            <textarea
              className={styles.textareaField}
              placeholder="Alguma observação sobre hoje?"
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