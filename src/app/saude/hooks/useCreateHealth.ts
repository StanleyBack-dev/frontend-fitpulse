"use client";

import { useState } from "react";
import { graphqlClient } from "../../../services/graphql/qraphqlClient";

interface CreateHealthInput {
  weightKg: number;
  observation?: string;
  measurementDate: string;
}

interface CreateHealthResponse {
  createHealth: {
    idHealth: string;
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

  const createHealth = async (input: CreateHealthInput): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const mutation = `
      mutation CreateHealth($input: CreateHealthInputDto!) {
        createHealth(input: $input) {
          idHealth
          weightKg
          bmi
          bmiStatus
          measurementDate
        }
      }
    `;

    try {
      const data = await graphqlClient<CreateHealthResponse>(mutation, { input });
      return !!data.createHealth;
    } catch (err: any) {
      const message =
        err?.response?.errors?.[0]?.message ||
        err?.message ||
        "Erro ao criar medição";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { createHealth, loading, error };
}