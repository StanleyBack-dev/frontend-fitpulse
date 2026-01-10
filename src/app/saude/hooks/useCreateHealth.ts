"use client";

import { useState } from "react";
import { graphqlClient } from "../../../services/graphql/qraphqlClient";

interface CreateHealthInput {
  heightCm: number;
  weightKg: number;
  observation?: string;
  measurementDate: string;
}

interface CreateHealthResponse {
  createHealth: {
    idHealth: string;
    heightCm: number;
    weightKg: number;
    bmi: number;
    bmiStatus: string;
    observation?: string;
    measurementDate: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function useCreateHealth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createHealth = async (input: CreateHealthInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const mutation = `
      mutation CreateHealth($input: CreateHealthInputDto!) {
        createHealth(input: $input) {
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
      const data = await graphqlClient<CreateHealthResponse>(mutation, { input });
      setSuccess(true);
      return !!data.createHealth;
    } catch (err: any) {
      const message =
        err.response?.errors?.[0]?.message ||
        err.message ||
        "Erro ao criar registro de saúde";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createHealth,
    loading,
    error,
    success,
  };
}