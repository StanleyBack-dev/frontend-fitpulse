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
  const { showSuccess, showError } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [formData, setFormData] = useState({
    heightCm: "",
    weightKg: "",
    bmi: "",
    bmiStatus: "",
    observation: "",
    measurementDate: "",
  });

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id) {
      getHealth({ idHealth: id });
    }
  }, [id]);

  useEffect(() => {
    if (!recordLoaded && records.length > 0) {
      const record = records[0];
      if (record) {
        setFormData({
          heightCm: (record.heightCm / 100).toFixed(2).replace(".", ","),
          weightKg: record.weightKg.toFixed(2).replace(".", ","),
          bmi: record.bmi.toFixed(2).replace(".", ","),
          bmiStatus: record.bmiStatus,
          observation: record.observation || "",
          measurementDate: new Date(record.measurementDate)
            .toISOString()
            .slice(0, 10),
        });
        setRecordLoaded(true);
      }
    }
  }, [records, recordLoaded]);

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
    }
  }, [formData.heightCm, formData.weightKg]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Atualizando...");

    const rawWeight = parseFormattedToNumber(formData.weightKg);
    const rawHeightMeters = parseFormattedToNumber(formData.heightCm);
    const heightInCm = Math.round(rawHeightMeters * 100);

    const success = await updateHealth({
      idHealth: id,

      heightCm: heightInCm,

      weightKg: rawWeight,

      observation: formData.observation,

      measurementDate: formData.measurementDate,
    });

    hideLoading();

    if (success) {
      showSuccess("Registro atualizado!");
      router.push("/historico");
    } else {
      showError("Erro ao atualizar.");
    }
  };

  if (!id || loadingGet) return null;

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
                value={formData.heightCm}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heightCm: decimalMask(e.target.value, 2).formatted,
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

              {/* MUDANÇA AQUI: Trocamos Input por Div para ajustar a largura */}
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

        <button
          type="submit"
          className={styles.saveBtn}
          disabled={loadingUpdate}
        >
          {loadingUpdate ? (
            "Salvando..."
          ) : (
            <>
              <Save size={20} /> Atualizar
            </>
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