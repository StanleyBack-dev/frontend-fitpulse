"use client";

import { useState, useEffect } from "react";
import { graphqlClient } from "../../../../services/graphql/qraphqlClient";

interface GetProfileResponse {
  getMyProfile: {
    idProfiles: string;
    phone?: string;
    currentWeight?: number;
    currentHeight?: number;
    currentImc?: number;
    birthDate?: string;
    sex?: 'male' | 'female' | 'other';
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goal?: 'lose_weight' | 'maintain' | 'gain_weight';
    createdAt: string;
    updatedAt: string;
  };
}

export function useGetProfile() {
  const [profile, setProfile] = useState<GetProfileResponse['getMyProfile'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const query = `
      query GetMyProfile {
        getMyProfile {
          idProfiles
          phone
          currentWeight
          currentHeight
          currentImc
          birthDate
          sex
          activityLevel
          goal
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient<GetProfileResponse>(query);
      setProfile(data.getMyProfile);
      return !!data.getMyProfile;
    } catch (err: any) {
      const message = err.response?.errors?.[0]?.message || err.message || "Erro ao buscar perfil";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    fetchProfile,
    loading,
    error,
  };
}