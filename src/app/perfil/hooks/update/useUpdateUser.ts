"use client";

import { useState } from "react";
import { graphqlClient } from "../../../../services/graphql/qraphqlClient";

interface UpdateUserInput {
  name?: string;
}

interface UpdateUserResponse {
  updateUser: {
    name: string;
    updatedAt: string;
  };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (input: UpdateUserInput): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const mutation = `
      mutation UpdateUser($input: UpdateUserInputDto!) {
        updateUser(input: $input) {
          name
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient<UpdateUserResponse>(mutation, { input });
      return !!data.updateUser;
    } catch (err: any) {
      const message = err.response?.errors?.[0]?.message || err.message || "Erro ao atualizar usuário";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    loading,
    error,
  };
}