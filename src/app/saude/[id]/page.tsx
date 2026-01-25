"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Ruler,
  Weight,
  FileText,
  Calculator,
  Save,
  Trash2,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../components/HealthForm.module.css";
import { useUpdateHealth } from "../hooks/useUpdateHealth";
import { useGetHealth } from "../hooks/useGetHealth";
import { useUpdateProfile } from "../../perfil/hooks/update/useUpdateProfile";
import { useGetProfile } from "../../perfil/hooks/get/useGetProfile";
import { useToast } from "../../../components/toasts/ToastProvider";
import { useLoading } from "../../../components/screens/loading.context";
import { decimalMask, parseFormattedToNumber } from "../../../utils/mask.util";
import { getBmiStatus } from "../../../utils/getBmiStatus";
import { sanitizeObservation } from "../../../utils/inputFormt.util";

export default function UpdateHealthPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [recordLoaded, setRecordLoaded] = useState(false);

  const router = useRouter();
  const { updateHealth, loading: loadingUpdate } = useUpdateHealth();
  const { getHealth, records, loading: loadingGet } = useGetHealth();
  const { updateProfile } = useUpdateProfile();
  const { profile, fetchProfile, loading: loadingProfile } = useGetProfile();
  const { showSuccess, showError } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [formData, setFormData] = useState({
    heightM: "",
    weightKg: "",
    bmi: "",
    bmiStatus: "",
    observation: "",
    measurementDate: "",
  });

  // Pega o ID da URL
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Busca o registro de saúde específico
  useEffect(() => {
    if (id) getHealth({ idHealth: id });
  }, [id]);

  // Quando o perfil for carregado, define a altura inicial
  useEffect(() => {
    const height = profile?.heightM;
    if (height && !formData.heightM) {
      setFormData((prev) => ({
        ...prev,
        heightM: height.toFixed(2).replace(".", ","),
      }));
    }
  }, [profile?.heightM]);

  // Quando o registro for carregado, preenche os dados
  useEffect(() => {
    if (!recordLoaded && records.length > 0) {
      const record = records[0];
      setFormData((prev) => ({
        ...prev,
        weightKg: record.weightKg.toFixed(2).replace(".", ","),
        bmi: record.bmi.toFixed(2).replace(".", ","),
        bmiStatus: record.bmiStatus,
        observation: record.observation || "",
        measurementDate: new Date(record.measurementDate)
          .toISOString()
          .slice(0, 10),
      }));
      setRecordLoaded(true);
    }
  }, [records, recordLoaded]);

  // Calcula IMC automaticamente
  useEffect(() => {
    const heightMeters = parseFormattedToNumber(formData.heightM);
    const weight = parseFormattedToNumber(formData.weightKg);

    if (heightMeters > 0 && weight > 0) {
      const bmi = weight / Math.pow(heightMeters, 2);
      setFormData((prev) => ({
        ...prev,
        bmi: bmi.toFixed(2).replace(".", ","),
        bmiStatus: getBmiStatus(bmi),
      }));
    }
  }, [formData.heightM, formData.weightKg]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawWeight = parseFormattedToNumber(formData.weightKg);
    const rawHeightMeters = parseFormattedToNumber(formData.heightM);

    if (!rawHeightMeters || rawHeightMeters <= 0) {
      showError("Informe sua altura antes de atualizar a medição.");
      return;
    }

    showLoading("Atualizando...");

    try {
      // 1️⃣ Atualiza a altura no perfil
      await updateProfile({ heightM: rawHeightMeters });

      // 2️⃣ Atualiza o registro de saúde
      const updated = await updateHealth({
        idHealth: id,
        weightKg: rawWeight,
        observation: formData.observation || undefined,
        measurementDate: formData.measurementDate,
      });

      hideLoading();

      if (updated) {
        showSuccess("Medição atualizada com sucesso!");
        await fetchProfile();

        setFormData({
          heightM: rawHeightMeters.toFixed(2).replace(".", ","),
          weightKg: updated.weightKg.toFixed(2).replace(".", ","),
          bmi: updated.bmi.toFixed(2).replace(".", ","),
          bmiStatus: updated.bmiStatus,
          observation: updated.observation || "",
          measurementDate: new Date(updated.measurementDate)
            .toISOString()
            .slice(0, 10),
        });
      } else {
        showError("Erro ao atualizar a medição.");
      }
    } catch (err: any) {
      hideLoading();
      const backendMessage =
        err?.response?.errors?.[0]?.message ||
        err?.message ||
        "Erro inesperado ao atualizar medição.";
      showError(backendMessage);
    }
  };

  if (!id || loadingGet || loadingProfile) return null;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Editar Registro</h1>
      </header>

      <form className={styles.content} onSubmit={handleUpdate}>
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
                className={styles.inputInline}
                value={formData.weightKg}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weightKg: decimalMask(e.target.value, 2).formatted,
                  })
                }
                inputMode="decimal"
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
                className={styles.inputInline}
                value={formData.heightM}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heightM: decimalMask(e.target.value, 2).formatted,
                  })
                }
                inputMode="decimal"
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
                className={`${styles.inputInline} ${styles.readonlyField}`}
                value={formData.bmi}
                readOnly
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
                value={formData.observation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    observation: sanitizeObservation(e.target.value, 200),
                  })
                }
                placeholder="Observações..."
              />
            </div>
          </div>
        </section>

        <button type="submit" className={styles.saveBtn} disabled={loadingUpdate}>
          {!loadingUpdate ? (
            <>
              <Save size={20} /> Atualizar Medição
            </>
          ) : (
            "Salvando..."
          )}
        </button>

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => alert("Implementar delete!")}
        >
          <Trash2 size={20} /> Excluir Registro
        </button>
      </form>
    </main>
  );
}