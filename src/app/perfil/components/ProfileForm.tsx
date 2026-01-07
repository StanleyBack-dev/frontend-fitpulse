"use client";

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Target,
  Save,
  Type,
  Calculator,
} from "lucide-react";
import styles from "./ProfileForm.module.css";
import { useUpdateProfile } from "../hooks/update/useUpdateProfile";
import { useGetProfile } from "../hooks/get/useGetProfile";
import {
  calculateImc,
  sanitizeDecimalToInt,
  toDateOnly,
} from "@/utils/calculateImc";
import { useToast } from "../../../components/toasts/ToastProvider";
import { useLoading } from "../../../components/screens/loading.context";

export default function ProfileForm() {
  const { showLoading, hideLoading } = useLoading();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentWeight: "",
    currentHeight: "",
    currentImc: "",
    birthDate: "",
    sex: "male" as "male" | "female" | "other",
    activityLevel: "moderate" as
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "very_active",
    goal: "maintain" as "lose_weight" | "maintain" | "gain_weight",
  });

  const { updateProfile, loading } = useUpdateProfile();
  const { profile, loading: loadingGet, error: errorGet } = useGetProfile();

  // Mostra loading global enquanto busca perfil
  useEffect(() => {
    if (loadingGet) {
      showLoading("Carregando perfil...");
    } else {
      hideLoading();
      if (profile) {
        setFormData({
          name: profile.name || "",
          phone: profile.phone || "",
          currentWeight: profile.currentWeight?.toString() || "",
          currentHeight: profile.currentHeight?.toString() || "",
          currentImc: profile.currentImc?.toFixed(2) || "",
          birthDate: profile.birthDate || "",
          sex: profile.sex || "male",
          activityLevel: profile.activityLevel || "moderate",
          goal: profile.goal || "maintain",
        });
      }
    }
  }, [loadingGet, profile, showLoading, hideLoading]);

  useEffect(() => {
    const weight = parseInt(formData.currentWeight);
    const height = parseInt(formData.currentHeight);
    const imc = calculateImc(weight, height);
    setFormData((prev) => ({
      ...prev,
      currentImc: imc ? imc.toFixed(2) : "",
    }));
  }, [formData.currentWeight, formData.currentHeight]);

  // Submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Atualizando perfil...");

    const weight = parseInt(formData.currentWeight) || undefined;
    const height = parseInt(formData.currentHeight) || undefined;
    const imcInt = sanitizeDecimalToInt(formData.currentImc) || undefined;
    const dateOnly = toDateOnly(formData.birthDate) || undefined;

    try {
      const result = await updateProfile({
        phone: formData.phone || undefined,
        currentWeight: weight,
        currentHeight: height,
        currentImc: imcInt,
        birthDate: dateOnly,
        sex: formData.sex,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
      });

      hideLoading();

      if (result) {
        showSuccess("Perfil atualizado com sucesso!");
      } else {
        showError("Não foi possível atualizar o perfil.");
      }
    } catch (err: any) {
      hideLoading();
      showError(err.message || "Ocorreu um erro inesperado.");
    }
  };

  // Entrada numérica para peso e altura
  const handleNumberInput = (
    field: "currentWeight" | "currentHeight",
    value: string
  ) => {
    const numeric = value.replace(/\D/g, "");
    if (numeric.length <= 3) setFormData({ ...formData, [field]: numeric });
  };

  if (errorGet) return <p className={styles.errorText}>{errorGet}</p>;

  return (
    <form className={styles.content} onSubmit={handleSubmit}>
      {/* SEÇÃO: CONTA */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Informações da Conta</h3>
        <div className={styles.card}>
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Type size={20} />
              </span>
              <input
                className={styles.inputField}
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Phone size={20} />
              </span>
              <input
                className={styles.inputField}
                placeholder="Telefone (DDD)"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: BIOMETRIA */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Biometria</h3>
        <div className={styles.card}>
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Weight size={20} />
              </span>
              <span className={styles.label}>Peso (kg)</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              className={styles.inputInline}
              placeholder="Ex: 80 kg"
              value={formData.currentWeight}
              onChange={(e) =>
                handleNumberInput("currentWeight", e.target.value)
              }
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Ruler size={20} />
              </span>
              <span className={styles.label}>Altura (cm)</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              className={styles.inputInline}
              placeholder="Ex: 180 cm"
              value={formData.currentHeight}
              onChange={(e) =>
                handleNumberInput("currentHeight", e.target.value)
              }
            />
          </div>

          <div className={styles.divider} />

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
              placeholder="Calculado"
              value={formData.currentImc}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Calendar size={20} />
              </span>
              <span className={styles.label}>Nascimento</span>
            </div>
            <input
              type="date"
              className={styles.inputDate}
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <User size={20} />
              </span>
              <span className={styles.label}>Gênero</span>
            </div>
            <select
              className={styles.selectField}
              value={formData.sex}
              onChange={(e) =>
                setFormData({ ...formData, sex: e.target.value as any })
              }
            >
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </select>
          </div>
        </div>
      </section>

      {/* SEÇÃO: PLANEJAMENTO */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Planejamento</h3>
        <div className={styles.card}>
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Activity size={20} />
              </span>
              <span className={styles.label}>Atividade</span>
            </div>
            <select
              className={styles.selectField}
              value={formData.activityLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  activityLevel: e.target.value as any,
                })
              }
            >
              <option value="sedentary">Sedentário</option>
              <option value="light">Leve</option>
              <option value="moderate">Moderado</option>
              <option value="active">Ativo</option>
              <option value="very_active">Atleta</option>
            </select>
          </div>

          <div className={styles.divider} />

          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Target size={20} />
              </span>
              <span className={styles.label}>Objetivo</span>
            </div>
            <select
              className={styles.selectField}
              value={formData.goal}
              onChange={(e) =>
                setFormData({ ...formData, goal: e.target.value as any })
              }
            >
              <option value="lose_weight">Perder Peso</option>
              <option value="maintain">Manter</option>
              <option value="gain_weight">Ganhar Massa</option>
            </select>
          </div>
        </div>
      </section>

      <button type="submit" className={styles.saveBtn} disabled={loading}>
        {!loading && <>
          <Save size={20} /> Salvar Alterações
        </>}
      </button>
    </form>
  );
}