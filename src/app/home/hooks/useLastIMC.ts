import { useEffect, useState } from "react";
import { getHealth } from "../../../services/healths/get/getHealth.service";
import { HealthCalculator, HealthInsights } from "../../../utils/health-calculator.util";

export function useLastIMC() {
  const [data, setData] = useState<HealthInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIMC() {
      try {
        setLoading(true);
        const query = `
          query {
            getHealth {
              bmi
              bmiStatus
              weightKg
              heightCm
              measurementDate
            }
          }
        `;
        
        const result = await getHealth(query);
        const list = result.getHealth;

        const insights = HealthCalculator.analyzeLatest(list);
        
        setData(insights);

      } catch (error) {
        console.error("Erro ao buscar dados de saúde:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchIMC();
  }, []);

  return { data, loading };
}