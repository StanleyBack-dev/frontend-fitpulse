import { useEffect, useState } from "react";
import { getHealth } from "../../../services/healths/get/getHealth.service";

export function useLastIMC() {
  const [data, setData] = useState<{ bmi: number; bmiStatus: string, measurementDate: string } | null>(null);
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
              measurementDate
            }
          }
        `;
        
        const result = await getHealth(query);
        const list = result.getHealth;

        if (list && list.length > 0) {
          const sortedList = list.sort((a: any, b: any) => 
             new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime()
          );
          setData(sortedList[0]);
        } else {
            setData(null);
        }
      } catch (error) {
        console.error("Erro ao buscar último IMC:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchIMC();
  }, []);
  return { data, loading };
}