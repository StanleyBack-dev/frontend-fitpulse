"use client";

import { useState } from "react";
import { graphqlClient } from "../../../../services/graphql/qraphqlClient";

interface UpdateProfileInput {
  phone?: string;
  currentWeight?: number;
  currentHeight?: number;
  currentImc?: number;
  birthDate?: string;
  sex?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose_weight' | 'maintain' | 'gain_weight';
}

interface UpdateProfileResponse {
  updateMyProfile: {
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

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = async (input: UpdateProfileInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const mutation = `
      mutation UpdateMyProfile($input: UpdateProfileInputDto!) {
        updateMyProfile(input: $input) {
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
      const data = await graphqlClient<UpdateProfileResponse>(mutation, { input });
      setSuccess(true);
      return !!data.updateMyProfile;
    } catch (err: any) {
      const message = err.response?.errors?.[0]?.message || err.message || "Erro ao atualizar perfil";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
    success,
  };
}