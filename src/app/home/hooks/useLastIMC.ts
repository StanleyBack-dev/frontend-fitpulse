import { useEffect, useState } from "react";
import { getHealth } from "../../../services/healths/get/getHealth.service";

export function useLastIMC() {
  const [data, setData] = useState<{ bmi: number; bmiStatus: string } | null>(null);

  useEffect(() => {
    async function fetchIMC() {
      const query = `
        query {
          getHealth {
            bmi
            bmiStatus
            measurementDate
          }
        }
      `;
      
      try {
        const result = await getHealth(query);
        const list = result.getHealth;

        if (list && list.length > 0) {
          const sortedList = list.sort((a: any, b: any) => 
            new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime()
          );

          setData(sortedList[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar último IMC:", error);
      }
    }

    fetchIMC();
  }, []);

  return data;
}