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

// --- HOOKS ---
import { useUpdateProfile } from "../hooks/update/useUpdateProfile"; // Update Biometria
import { useUpdateUser } from "../hooks/update/useUpdateUser";       // Update Nome
import { useGetProfile } from "../hooks/get/useGetProfile";          // Get Biometria
import { useGetUser } from "../hooks/get/useGetUser";                // Get Nome

// --- UTILS & CONTEXTS ---
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

  // Estado do Formulário
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentWeight: "",
    currentHeight: "",
    currentImc: "",
    birthDate: "",
    sex: "male" as "male" | "female" | "other",
    activityLevel: "moderate" as "sedentary" | "light" | "moderate" | "active" | "very_active",
    goal: "maintain" as "lose_weight" | "maintain" | "gain_weight",
  });

  // --- INSTÂNCIA DOS HOOKS ---
  
  // Hooks de Escrita (Update)
  const { updateProfile, loading: loadingProfileUpdate } = useUpdateProfile();
  const { updateUser, loading: loadingUserUpdate } = useUpdateUser();

  // Hooks de Leitura (Get)
  const { profile, loading: loadingGet } = useGetProfile();
  const { user, loading: loadingUser, fetchUser } = useGetUser();

  // Flags de Carregamento
  const isLoadingData = loadingGet || loadingUser;
  const isSaving = loadingProfileUpdate || loadingUserUpdate;

  // 1. CARREGAR DADOS INICIAIS
  useEffect(() => {
    if (isLoadingData) {
      showLoading("Carregando perfil...");
    } else {
      hideLoading();
      
      // Só preenche se tivermos dados de User ou Profile
      if (profile || user) {
        setFormData((prev) => ({
          ...prev, // Mantém o que já foi digitado caso o effect rode novamente
          
          // Dados do Usuário (Nome)
          name: user?.name || prev.name || "",
          
          // Dados do Perfil (Biometria)
          phone: profile?.phone || prev.phone || "",
          currentWeight: profile?.currentWeight?.toString() || prev.currentWeight || "",
          currentHeight: profile?.currentHeight?.toString() || prev.currentHeight || "",
          currentImc: profile?.currentImc?.toFixed(2) || prev.currentImc || "",
          birthDate: profile?.birthDate || prev.birthDate || "",
          sex: profile?.sex || prev.sex || "male",
          activityLevel: profile?.activityLevel || prev.activityLevel || "moderate",
          goal: profile?.goal || prev.goal || "maintain",
        }));
      }
    }
  }, [isLoadingData, profile, user, showLoading, hideLoading]);

  // 2. CÁLCULO AUTOMÁTICO DE IMC
  useEffect(() => {
    const weight = parseInt(formData.currentWeight);
    const height = parseInt(formData.currentHeight);
    const imc = calculateImc(weight, height);
    
    setFormData((prev) => ({
      ...prev,
      currentImc: imc ? imc.toFixed(2) : "",
    }));
  }, [formData.currentWeight, formData.currentHeight]);

  // 3. SUBMIT DO FORMULÁRIO (SALVAR TUDO)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Salvando alterações...");

    // Tratamento de tipos (string -> number/date)
    const weight = parseInt(formData.currentWeight) || undefined;
    const height = parseInt(formData.currentHeight) || undefined;
    const imcInt = sanitizeDecimalToInt(formData.currentImc) || undefined;
    const dateOnly = toDateOnly(formData.birthDate) || undefined;

    try {
      // Dispara as duas atualizações em paralelo para ser mais rápido
      const [profileResult, userResult] = await Promise.all([
        // Atualiza tabela Profiles
        updateProfile({
          phone: formData.phone || undefined,
          currentWeight: weight,
          currentHeight: height,
          currentImc: imcInt,
          birthDate: dateOnly,
          sex: formData.sex,
          activityLevel: formData.activityLevel,
          goal: formData.goal,
        }),
        // Atualiza tabela Users (Nome)
        updateUser({
          name: formData.name,
        })
      ]);

      hideLoading();

      // Verifica sucesso
      if (profileResult && userResult) {
        showSuccess("Perfil atualizado com sucesso!");
        // Recarrega o usuário para garantir que o nome novo fique salvo no contexto
        fetchUser(); 
      } else if (!userResult) {
         showError("Erro ao atualizar o nome. Tente novamente.");
      } else {
         showError("Erro ao atualizar dados biométricos.");
      }

    } catch (err: any) {
      hideLoading();
      showError(err.message || "Ocorreu um erro inesperado.");
    }
  };

  // Helper para inputs numéricos
  const handleNumberInput = (field: "currentWeight" | "currentHeight", value: string) => {
    const numeric = value.replace(/\D/g, "");
    if (numeric.length <= 3) setFormData({ ...formData, [field]: numeric });
  };

  return (
    <form className={styles.content} onSubmit={handleSubmit}>
      
      {/* SEÇÃO 1: INFORMAÇÕES DA CONTA */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Informações da Conta</h3>
        <div className={styles.card}>
          
          {/* CAMPO NOME */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Type size={20} />
              </span>
              <input
                className={styles.inputField}
                placeholder="Seu nome completo"
                value={formData.name}
                // Habilitado para edição
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.divider} />

          {/* CAMPO TELEFONE */}
          <div className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.icon}>
                <Phone size={20} />
              </span>
              <input
                className={styles.inputField}
                placeholder="Telefone (DDD)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: BIOMETRIA */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Biometria</h3>
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
              inputMode="numeric"
              className={styles.inputInline}
              placeholder="Ex: 80"
              value={formData.currentWeight}
              onChange={(e) => handleNumberInput("currentWeight", e.target.value)}
            />
          </div>

          <div className={styles.divider} />

          {/* ALTURA */}
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
              placeholder="Ex: 180"
              value={formData.currentHeight}
              onChange={(e) => handleNumberInput("currentHeight", e.target.value)}
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
              placeholder="Auto"
              value={formData.currentImc}
            />
          </div>

          <div className={styles.divider} />

          {/* DATA NASCIMENTO */}
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
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
            >
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </select>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: PLANEJAMENTO */}
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
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
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
              onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
            >
              <option value="lose_weight">Perder Peso</option>
              <option value="maintain">Manter</option>
              <option value="gain_weight">Ganhar Massa</option>
            </select>
          </div>
        </div>
      </section>

      {/* BOTÃO SALVAR */}
      <button type="submit" className={styles.saveBtn} disabled={isSaving}>
        {!isSaving && (
          <>
            <Save size={20} /> Salvar Alterações
          </>
        )}
        {isSaving && "Salvando..."}
      </button>
    </form>
  );
}