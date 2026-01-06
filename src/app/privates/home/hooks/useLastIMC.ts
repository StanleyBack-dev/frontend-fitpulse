import { useEffect, useState } from "react";
import { getHealth } from "../../../../services/healths/get/getHealth.service";

export function useLastIMC() {
  const [data, setData] = useState<{ bmi: number; bmiStatus: string } | null>(null);

  useEffect(() => {
    async function fetchIMC() {
      const query = `
        query {
          getHealth {
            bmi
            bmiStatus
          }
        }
      `;
      const result = await getHealth(query);
      const list = result.getHealth;
      if (list.length > 0) {
        setData(list[list.length - 1]);
      }
    }

    fetchIMC();
  }, []);

  return data;
}