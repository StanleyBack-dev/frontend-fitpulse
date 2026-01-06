"use client";

import { useEffect, useState } from "react";
import { graphqlClient } from "../../../../services/graphql/qraphqlClient";

export interface UserProfile {
  name: string;
  urlAvatar?: string;
}

interface MeResponse {
  me: UserProfile;
}

export function useMyUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const query = `
        query {
          me {
            name
            urlAvatar
          }
        }
      `;

      try {
        const data = await graphqlClient<MeResponse>(query);
        setUser(data.me);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading };
}