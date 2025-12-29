// ... imports anteriores
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

// NOVA FUNÇÃO DE GET
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
      credentials: 'include', // Necessário para o @CurrentUser funcionar
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    // Se houver erros, verificamos se é porque o perfil não existe
    if (result.errors) {
      const errorMessage = result.errors[0]?.message;
      
      // Se for erro de "Não encontrado", retornamos null (usuário novo)
      if (errorMessage.includes("não encontrado")) {
        return null; 
      }
      
      console.warn("Erro ao buscar profile:", errorMessage);
      return null;
    }

    return result.data.getMyProfile;
  } catch (error) {
    console.error("Erro de rede (Get Profile):", error);
    return null;
  }
}