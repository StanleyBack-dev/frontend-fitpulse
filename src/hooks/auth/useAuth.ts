"use client";

import { useEffect, useState } from "react";
import { refreshSession } from "../../services/auth/refresh/refreshAuth.service";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        setLoading(true);
        const session = await refreshSession();

        if (session.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  return { loading, authenticated };
}