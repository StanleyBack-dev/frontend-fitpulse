"use client";

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Calendar,
  Activity,
  Target,
  Save,
  Type,
  Ruler,
} from "lucide-react";
import styles from "./ProfileForm.module.css";

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ptBR from "react-phone-number-input/locale/pt-BR.json";

import { useUpdateProfile } from "../hooks/update/useUpdateProfile";
import { useUpdateUser } from "../hooks/update/useUpdateUser";
import { useGetProfile } from "../hooks/get/useGetProfile";
import { useGetUser } from "../hooks/get/useGetUser";

import { toDateOnly } from "@/utils/calculateImc";
import { useToast } from "../../../components/toasts/ToastProvider";
import { useLoading } from "../../../components/screens/loading.context";
import { decimalMask, parseFormattedToNumber } from "@/utils/mask.util";

export default function ProfileForm() {
  const { showLoading, hideLoading } = useLoading();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    sex: "male" as "male" | "female" | "other",
    heightM: "",
    activityLevel: "moderate" as
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "very_active",
    goal: "maintain" as "lose_weight" | "maintain" | "gain_weight",
  });

  const { updateProfile, loading: loadingProfileUpdate } = useUpdateProfile();
  const { updateUser, loading: loadingUserUpdate } = useUpdateUser();
  const { profile, loading: loadingGet } = useGetProfile();
  const { user, loading: loadingUser, fetchUser } = useGetUser();

  const isLoadingData = loadingGet || loadingUser;
  const isSaving = loadingProfileUpdate || loadingUserUpdate;

  useEffect(() => {
    if (isLoadingData) {
      showLoading("Carregando perfil...");
      return;
    }

    hideLoading();

    if (profile || user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.name || prev.name,
        phone: profile?.phone || prev.phone,
        birthDate: profile?.birthDate || prev.birthDate,
        sex: profile?.sex || prev.sex,
        heightM: profile?.heightM
          ? profile.heightM.toFixed(2).replace(".", ",")
          : prev.heightM,
        activityLevel: profile?.activityLevel || prev.activityLevel,
        goal: profile?.goal || prev.goal,
      }));
    }
  }, [isLoadingData, profile, user, showLoading, hideLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Salvando alterações...");

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      hideLoading();
      showError("Por favor, insira um número de telefone válido.");
      return;
    }

    const dateOnly = toDateOnly(formData.birthDate) || undefined;
    const rawHeight = parseFormattedToNumber(formData.heightM);

    try {
      const [profileResult, userResult] = await Promise.all([
        updateProfile({
          phone: formData.phone || undefined,
          birthDate: dateOnly,
          sex: formData.sex,
          heightM: rawHeight || undefined,
          activityLevel: formData.activityLevel,
          goal: formData.goal,
        }),
        updateUser({ name: formData.name }),
      ]);

      hideLoading();

      if (profileResult && userResult) {
        showSuccess("Perfil atualizado com sucesso!");
        fetchUser();
      } else {
        showError("Erro ao atualizar informações.");
      }
    } catch (err: any) {
      hideLoading();
      showError(err.message || "Ocorreu um erro inesperado.");
    }
  };

  return (
    <form className={styles.content} onSubmit={handleSubmit}>
      {/* INFORMAÇÕES PESSOAIS */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Informações pessoais</h3>
        <div className={styles.card}>
          {/* NOME */}
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

          {/* TELEFONE */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Phone size={20} />
              </span>
              <PhoneInput
                international
                defaultCountry="BR"
                labels={ptBR}
                placeholder="Telefone"
                value={formData.phone}
                onChange={(value) =>
                  setFormData({ ...formData, phone: value || "" })
                }
                numberInputProps={{
                  className: styles.inputPhoneReset,
                }}
                className={styles.phoneContainerLib}
              />
            </div>
          </div>

          <div className={styles.divider} />

          {/* NASCIMENTO */}
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

          {/* GÊNERO */}
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
        </div>
      </section>

      {/* PLANEJAMENTO */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Planejamento</h3>
        <div className={styles.card}>
          {/* NÍVEL DE ATIVIDADE */}
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

          {/* OBJETIVO */}
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

      <button type="submit" className={styles.saveBtn} disabled={isSaving}>
        {isSaving ? "Salvando..." : <><Save size={20} /> Salvar Alterações</>}
      </button>
    </form>
  );
}