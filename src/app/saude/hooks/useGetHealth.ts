"use client";

import { useState } from "react";
import { graphqlClient } from "../../../services/graphql/qraphqlClient";

interface HealthRecord {
  idHealth: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiStatus: string;
  observation?: string;
  measurementDate: string;
  createdAt: string;
  updatedAt: string;
}

interface GetHealthResponse {
  getHealth: HealthRecord[];
}

interface GetHealthInput {
  idHealth?: string;
  startDate?: string;
  endDate?: string;
}

export function useGetHealth() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getHealth = async (input?: GetHealthInput): Promise<HealthRecord[]> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const query = `
      query GetHealth($input: GetHealthInputDto) {
        getHealth(input: $input) {
          idHealth
          heightCm
          weightKg
          bmi
          bmiStatus
          observation
          measurementDate
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient<GetHealthResponse>(query, { input });
      setRecords(data.getHealth);
      setSuccess(true);
      return data.getHealth;
    } catch (err: any) {
      const message =
        err.response?.errors?.[0]?.message ||
        err.message ||
        "Erro ao buscar registros de saúde";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getHealth,
    records,
    loading,
    error,
    success,
  };
}