const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_URL.replace(/\/$/, '')}/graphql`;

// Adicione a interface de Update (pode ser igual a CreateProfileInput se os campos forem os mesmos)
export interface UpdateProfileInput {
  enterprise?: string;
  position?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  isOnline?: boolean;
  isAvailableForNetworking?: boolean;
}

// --- NOVA FUNÇÃO DE UPDATE ---
export async function updateMyProfile(data: UpdateProfileInput): Promise<boolean> {
  // Nota: O nome da mutation aqui deve bater com o nome do método no seu Resolver backend
  const mutation = `
    mutation UpdateMyProfile($input: UpdateProfileInputDto!) {
      updateMyProfile(input: $input) {
        idProfiles
        enterprise
        position
        updatedAt
      }
    }
  `;

  // Filtra o payload (remove idUsers, pois o update pega o ID do token @CurrentUser no backend)
  const payload = {
    enterprise: data.enterprise,
    position: data.position,
    phone: data.phone,
    website: data.website,
    linkedin: data.linkedin,
    instagram: data.instagram,
    twitter: data.twitter,
    isOnline: data.isOnline,
    isAvailableForNetworking: data.isAvailableForNetworking
  };

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Essencial para o backend saber quem é o @CurrentUser
      body: JSON.stringify({ 
        query: mutation,
        variables: { input: payload }
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("Erro ao atualizar profile:", result.errors);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro de rede (Update Profile):", error);
    return false;
  }
}