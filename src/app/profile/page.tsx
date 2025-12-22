"use client";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiShare2,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import styles from "./profile.module.css";

export default function ProfileForm() {
  const [step, setStep] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
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
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [slides.length]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Perfil enviado:", formData);
  };

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
          {/* INDICADOR DE ETAPAS */}
          <div className={styles.stepNav}>
            <div
              className={`${styles.stepBtn} ${
                step >= 1 ? styles.activeStep : ""
              }`}
            >
              <FiUser />
            </div>
            <div
              className={`${styles.stepLine} ${
                step >= 2 ? styles.activeLine : ""
              }`}
            />
            <div
              className={`${styles.stepBtn} ${
                step >= 2 ? styles.activeStep : ""
              }`}
            >
              <FiPhone />
            </div>
            <div
              className={`${styles.stepLine} ${
                step >= 3 ? styles.activeLine : ""
              }`}
            />
            <div
              className={`${styles.stepBtn} ${
                step >= 3 ? styles.activeStep : ""
              }`}
            >
              <FiShare2 />
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* ETAPA 1 */}
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

            {/* ETAPA 2 */}
            {step === 2 && (
              <div className={styles.tabContent}>
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

            {/* ETAPA 3 */}
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
                  >
                    <FiArrowLeft />
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Concluir <FiCheck />
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