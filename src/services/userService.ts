const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_URL.replace(/\/$/, '')}/graphql`;

export interface UserProfile {
  idUsers: string;
  name: string;
  email: string;
  urlAvatar?: string;
  userRole?: string;
}

export async function getMyProfile(): Promise<UserProfile | null> {
  const query = `
    query {
      me {
        idUsers
        name
        email
        urlAvatar
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
      // IMPORTANTE: Envia o cookie de autenticação
      credentials: 'include', 
      body: JSON.stringify({ query }),
    });

    if (!response.ok) return null;

    const result = await response.json();

    if (result.errors) {
      console.warn("Erro ao buscar perfil:", result.errors[0].message);
      return null;
    }

    return result.data.me;
  } catch (error) {
    console.error("Falha ao buscar dados do usuário:", error);
    return null;
  }
}