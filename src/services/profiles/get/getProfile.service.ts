const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_URL.replace(/\/$/, '')}/graphql`;

export interface ProfileData {
  idProfiles: string;
  idUsers: string;
  enterprise?: string;
  position?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  isOnline: boolean;
  isAvailableForNetworking: boolean;
}

export async function getMyProfile(): Promise<ProfileData | null> {
  const query = `
    query GetMyProfile {
      getMyProfile {
        idProfiles
        idUsers
        enterprise
        position
        phone
        website
        linkedin
        instagram
        twitter
        isOnline
        isAvailableForNetworking
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      const errorMessage = result.errors[0]?.message;
      
      if (errorMessage.includes("não encontrado")) {
        return null; 
      }
      
      return null;
    }

    return result.data.getMyProfile;

  } catch (error) {
    
    return null;
  }
}