"use client";

import { useState, useEffect } from "react";
import {
  Weight,
  FileText,
  Calendar,
  Calculator,
  Save,
  Activity,
  Ruler,
} from "lucide-react";
import styles from "./HealthForm.module.css";
import { useCreateHealth } from "../hooks/useCreateHealth";
import { useUpdateProfile } from "../../perfil/hooks/update/useUpdateProfile";
import { useToast } from "../../../components/toasts/ToastProvider";
import { useLoading } from "../../../components/screens/loading.context";
import { getBmiStatus } from "../../../utils/getBmiStatus";
import { sanitizeObservation } from "../../../utils/inputFormt.util";
import { decimalMask, parseFormattedToNumber } from "../../../utils/mask.util";
import { useGetProfile } from "../../perfil/hooks/get/useGetProfile";

export default function HealthForm() {
  const { createHealth, loading } = useCreateHealth();
  const { updateProfile } = useUpdateProfile();
  const { showSuccess, showError } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const { profile, fetchProfile, loading: loadingProfile } = useGetProfile();

  const [formData, setFormData] = useState({
    weightKg: "",
    heightM: "",
    bmi: "",
    bmiStatus: "",
    observation: "",
    measurementDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (profile?.heightM) {
      const meters = profile.heightM.toFixed(2).replace(".", ",");
      setFormData((prev) => ({
        ...prev,
        heightM: meters,
      }));
    }
  }, [profile?.heightM]);

  useEffect(() => {
    const weight = parseFormattedToNumber(formData.weightKg);
    const heightMeters = parseFormattedToNumber(formData.heightM);

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
  }, [formData.weightKg, formData.heightM]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawWeight = parseFormattedToNumber(formData.weightKg);
    const rawHeightMeters = parseFormattedToNumber(formData.heightM);
    await updateProfile({ heightM: rawHeightMeters });

    if (!rawHeightMeters || rawHeightMeters <= 0) {
      showError("Informe sua altura antes de registrar a medição.");
      return;
    }

    showLoading("Registrando...");

    try {
      await updateProfile({ heightM: rawHeightMeters });

      const result = await createHealth({
        weightKg: rawWeight,
        observation: formData.observation || undefined,
        measurementDate: formData.measurementDate,
      });

      hideLoading();

      if (result) {
        showSuccess("Altura e medição salvas com sucesso!");
        await fetchProfile();
        setFormData({
          ...formData,
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

      const backendMessage =
        err?.response?.errors?.[0]?.message ||
        err?.message ||
        "Erro inesperado ao salvar medição.";

      showError(backendMessage);
    }
  };

  if (loadingProfile) {
    return <p className={styles.loadingText}>Carregando perfil...</p>;
  }

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
              value={formData.heightM}
              onChange={(e) => {
                const { formatted } = decimalMask(e.target.value, 2);
                setFormData({ ...formData, heightM: formatted });
              }}
            />
          </div>

          <div className={styles.divider} />

          {/* IMC */}
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

          {/* STATUS */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Activity size={20} />
              </span>
              <span className={styles.label}>Status</span>
            </div>
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

      {/* OBSERVAÇÕES */}
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