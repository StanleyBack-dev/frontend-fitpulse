import { useEffect, useState } from "react";
import { getHealth } from "../../../services/healths/get/getHealth.service";
import { HealthCalculator, HealthInsights } from "../../../utils/health-calculator.util";
import { useGetProfile } from "../../perfil/hooks/get/useGetProfile";

export function useLastIMC() {
  const [data, setData] = useState<HealthInsights | null>(null);
  const [loading, setLoading] = useState(true);

  const { profile, loading: loadingProfile, fetchProfile } = useGetProfile();

  useEffect(() => {
    async function fetchIMC() {
      try {
        setLoading(true);

        await fetchProfile();

        const query = `
          query {
            getHealth {
              bmi
              bmiStatus
              weightKg
              measurementDate
            }
          }
        `;

        const result = await getHealth(query);
        const list = result.getHealth;

        const insights = HealthCalculator.analyzeLatest(list, profile?.heightM);

        setData(insights);

      } catch (error) {
        console.error("Erro ao buscar dados de saúde:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchIMC();
  }, [profile?.heightM]);

  return { data, loading: loading || loadingProfile };
}