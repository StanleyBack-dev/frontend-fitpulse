"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiUser,
  FiPhone,
  FiShare2,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiLoader
} from "react-icons/fi";
import styles from "./profile.module.css";

import { getMyUser } from "../../services/userService"; 
import { updateMyUser } from "../../services/userUpdateService";
import { createMyProfile } from "../../services/profileCreateService";
import { getMyProfile } from "../../services/profileGetService";
import { updateMyProfile } from "../../services/profileUpdateService";

export default function ProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [step, setStep] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    idUsers: "", 
    name: "",
    email: "",
    enterprise: "",
    position: "",
    phone: "",
    website: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    isOnline: true,
    isAvailableForNetworking: true,
  });

  const slides = [
    "Monte seu perfil em segundos e destaque-se 🚀",
    "Descubra novas conexões e oportunidades 💡",
    "Mostre sua presença no evento e seja notado 🌟",
  ];

  useEffect(() => {
    let isMounted = true;

    const loadAllData = async () => {
      try {
        const userData = await getMyUser();
        const profileData = await getMyProfile();

        if (isMounted && userData) {
          if (profileData) setHasExistingProfile(true);

          setFormData((prev) => ({
            ...prev,
            idUsers: userData.idUsers,
            name: userData.name || searchParams.get("name") || "",
            email: userData.email || searchParams.get("email") || "",
            enterprise: profileData?.enterprise || "",
            position: profileData?.position || "",
            phone: profileData?.phone || "",
            website: profileData?.website || "",
            linkedin: profileData?.linkedin || "",
            instagram: profileData?.instagram || "",
            twitter: profileData?.twitter || "",
            isOnline: profileData ? profileData.isOnline : true,
            isAvailableForNetworking: profileData
              ? profileData.isAvailableForNetworking
              : true,
          }));
        }
      } catch (err) {
        console.error("Erro de carga:", err);
        setError("Não foi possível carregar suas informações.");
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    loadAllData();

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [slides.length]); // removido searchParams para evitar re-renderização em loop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const requiredFilled = formData.name.trim().length > 0;

  const handleNext = () => {
    if (step === 1 && !requiredFilled) {
      setError("Por favor, preencha seu nome.");
      return;
    }
    setError(null);
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idUsers) {
      setError("Erro de identificação. Recarregue a página.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const userUpdated = await updateMyUser(formData);
      if (!userUpdated) throw new Error("Falha ao salvar nome.");

      let profileSuccess = false;

      if (hasExistingProfile) {
        profileSuccess = await updateMyProfile(formData);
      } else {
        profileSuccess = await createMyProfile(formData);
      }

      if (!profileSuccess) throw new Error("Falha ao salvar dados do perfil.");

      router.push("/home");
    } catch (err: any) {
      console.error(err);
      setError("Erro ao salvar dados. Tente novamente.");
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return (
      <main className={styles.container}>
        <div
          style={{
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            gap: "10px",
          }}
        >
          <FiLoader className={styles.spin} size={30} /> Carregando seus dados...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Conecte-se, Explore e Seja Visto 💜</h1>
          <div className={styles.sliderWrapper}>
            <div
              className={styles.slider}
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              {slides.map((text, i) => (
                <div key={i} className={styles.slide}>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className={styles.card}>
          <div className={styles.stepNav}>
            <div className={`${styles.stepBtn} ${step >= 1 ? styles.activeStep : ""}`}>
              <FiUser />
            </div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ""}`} />
            <div className={`${styles.stepBtn} ${step >= 2 ? styles.activeStep : ""}`}>
              <FiPhone />
            </div>
            <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ""}`} />
            <div className={`${styles.stepBtn} ${step >= 3 ? styles.activeStep : ""}`}>
              <FiShare2 />
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {step === 1 && (
              <div className={styles.tabContent}>
                <div className={styles.inputGroup}>
                  <label>
                    Nome Completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Cargo / Profissão</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Ex: UI Designer"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Empresa</label>
                  <input
                    type="text"
                    name="enterprise"
                    value={formData.enterprise}
                    onChange={handleChange}
                    placeholder="Ex: Pulse Tech"
                  />
                </div>
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={handleNext}
                >
                  Avançar <FiArrowRight />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={styles.tabContent}>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seuemail@exemplo.com"
                    readOnly={!!formData.email}
                    style={{ opacity: formData.email ? 0.7 : 1 }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Website (URL)</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="www.seusite.com"
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.backBtn}
                    onClick={() => setStep(1)}
                  >
                    <FiArrowLeft />
                  </button>
                  <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={handleNext}
                  >
                    Avançar <FiArrowRight />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.tabContent}>
                <div className={styles.inputGroup}>
                  <label>LinkedIn (URL)</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/seuuser"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Instagram (URL)</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="instagram.com/seuuser"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Twitter (URL)</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="twitter.com/seuuser"
                  />
                </div>

                <div className={styles.switchArea}>
                  <label className={styles.switchLabel}>
                    <input
                      type="checkbox"
                      name="isOnline"
                      checked={formData.isOnline}
                      onChange={handleChange}
                    />
                    <span>Online agora</span>
                  </label>
                  <label className={styles.switchLabel}>
                    <input
                      type="checkbox"
                      name="isAvailableForNetworking"
                      checked={formData.isAvailableForNetworking}
                      onChange={handleChange}
                    />
                    <span>Networking disponível</span>
                  </label>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.backBtn}
                    onClick={() => setStep(2)}
                    disabled={isSaving}
                  >
                    <FiArrowLeft />
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSaving}
                    style={{
                      opacity: isSaving ? 0.7 : 1,
                      cursor: isSaving ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {isSaving ? (
                      <>
                        <FiLoader className={styles.spin} /> Salvando...
                      </>
                    ) : (
                      <>
                        Concluir <FiCheck />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}