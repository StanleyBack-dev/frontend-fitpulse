"use client";

import { useState, useEffect } from "react";
import { graphqlClient } from "../../../../services/graphql/qraphqlClient";

interface GetUserResponse {
  me: {
    name: string;
  };
}

export function useGetUser() {
  const [user, setUser] = useState<GetUserResponse['me'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const query = `
      query Me {
        me {
          name
        }
      }
    `;

    try {
      const data = await graphqlClient<GetUserResponse>(query);
      setUser(data.me);
      return !!data.me;
    } catch (err: any) {
      const message = err.response?.errors?.[0]?.message || err.message || "Erro ao buscar usuário";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    fetchUser,
    loading,
    error,
  };
}