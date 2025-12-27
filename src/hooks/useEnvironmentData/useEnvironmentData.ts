"use client";
import { useEffect, useState } from "react";

interface Participant {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface Ad {
  id: number;
  x: number;
  y: number;
  content: string;
}

interface EnvironmentData {
  participants: Participant[];
  ads: Ad[];
}

export const useEnvironmentData = () => {
  const [eventData, setEventData] = useState<EnvironmentData>({
    participants: [],
    ads: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Mock data temporário
      const data: EnvironmentData = {
        participants: [
          { id: 1, name: "Alice", x: 200, y: 300 },
          { id: 2, name: "Bob", x: 400, y: 250 },
        ],
        ads: [
          { id: 1, x: 50, y: 50, content: "Seu anúncio aqui!" },
          { id: 2, x: 700, y: 50, content: "Publicidade" },
        ],
      };
      setEventData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { eventData, loading };
};