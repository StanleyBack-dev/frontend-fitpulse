"use client";

import { useState } from "react";
import { graphqlClient } from "../../../services/graphql/qraphqlClient";

interface UpdateHealthInput {
  idHealth: string;
  heightCm?: number;
  weightKg?: number;
  observation?: string;
  measurementDate?: string;
}

interface UpdateHealthResponse {
  updateHealth: {
    idHealth: string;
    heightCm: number;
    weightKg: number;
    bmi: number;
    bmiStatus: string;
    observation?: string;
    measurementDate: string;
    updatedAt: string;
  };
}

export function useUpdateHealth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateHealth = async (input: UpdateHealthInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const mutation = `
      mutation UpdateHealth($input: UpdateHealthInputDto!) {
        updateHealth(input: $input) {
          idHealth
          heightCm
          weightKg
          bmi
          bmiStatus
          observation
          measurementDate
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient<UpdateHealthResponse>(mutation, { input });
      setSuccess(true);
      return data.updateHealth;
    } catch (err: any) {
      const message =
        err.response?.errors?.[0]?.message ||
        err.message ||
        "Erro ao atualizar registro de saúde";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateHealth,
    loading,
    error,
    success,
  };
}