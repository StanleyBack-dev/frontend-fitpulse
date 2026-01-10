"use client";

import { useEffect, useMemo } from "react";
import { ArrowLeft, Calendar, Activity, FileText, TrendingUp, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetHealth } from "../saude/hooks/useGetHealth";
import { useToast } from "../../components/toasts/ToastProvider";
import { useLoading } from "../../components/screens/loading.context";
import styles from "./history.module.css";
import { formatDateToBR } from "@/utils/date.util";

export default function HealthHistoryPage() {
  const { getHealth, records: healthRecords, loading: loadingGet, error: errorGet } = useGetHealth();
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const { showError } = useToast();

  useEffect(() => {
    getHealth();
  }, []);

  useEffect(() => {
    if (loadingGet) {
      showLoading("Carregando histórico...");
    } else {
      hideLoading();
    }
  }, [loadingGet, showLoading, hideLoading]);

  useEffect(() => {
    if (errorGet) showError("Não foi possível carregar o histórico.");
  }, [errorGet, showError]);

  const handleClick = (id: string) => {
    router.push(`/saude/${id}`);
  };

  const sortedRecords = useMemo(() => {
    if (!healthRecords) return [];
    return [...healthRecords].sort((a, b) =>
      new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime()
    );
  }, [healthRecords]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => window.history.back()} className={styles.backBtn}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Histórico</h1>
      </header>

      <div className={styles.content}>
        {sortedRecords.length === 0 && !loadingGet ? (
          <p className={styles.emptyText}>Nenhum registro encontrado.</p>
        ) : (
          <section className={styles.group}>
            <h3 className={styles.groupTitle}>Registros Anteriores</h3>
            <div className={styles.list}>
              {sortedRecords.map((r) => (
                <div key={r.idHealth} className={styles.card} onClick={() => handleClick(r.idHealth)}>
                  
                  {/* Linha 1: Data e Status */}
                  <div className={styles.item}>
                    <div className={styles.itemLeft}>
                      <span className={styles.icon}>
                        <Calendar size={20} />
                      </span>
                      <span className={styles.label}>
                        {formatDateToBR(r.measurementDate)}
                      </span>
                    </div>
                    <div
                      className={`${styles.status} ${
                        r.bmiStatus.includes("Ideal")
                          ? styles.good
                          : r.bmiStatus.includes("Sobrepeso")
                          ? styles.warning
                          : styles.danger
                      }`}
                    >
                      {r.bmiStatus}
                    </div>
                  </div>

                  <div className={styles.divider} />

                  {/* Linha 2: Peso */}
                  <div className={styles.item}>
                    <div className={styles.itemLeft}>
                      <span className={styles.icon}>
                        <Activity size={20} />
                      </span>
                      <span className={styles.label}>Peso</span>
                    </div>
                    <span className={styles.value}>{r.weightKg.toFixed(1)} kg</span>
                  </div>

                  <div className={styles.divider} />

                  {/* Linha 3: IMC */}
                  <div className={styles.item}>
                    <div className={styles.itemLeft}>
                      <span className={styles.icon}>
                        <TrendingUp size={20} />
                      </span>
                      <span className={styles.label}>IMC</span>
                    </div>
                    <span className={styles.value}>{r.bmi.toFixed(1)}</span>
                  </div>

                  {/* Linha 4: Observação (se houver) */}
                  {r.observation && (
                    <>
                      <div className={styles.divider} />
                      <div className={styles.item}>
                        <div className={styles.itemLeft}>
                          <span className={styles.icon}>
                            <FileText size={20} />
                          </span>
                          <span className={`${styles.label} ${styles.truncate}`}>
                            {r.observation}
                          </span>
                        </div>
                        <ChevronRight size={16} className={styles.arrowIcon} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}