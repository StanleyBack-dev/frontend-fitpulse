const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_URL.replace(/\/$/, '')}/graphql`;

export interface UpdateUserProfileInput {
  idUsers: string;
  name?: string;
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

export async function updateMyUser(data: UpdateUserProfileInput): Promise<boolean> {
  const mutation = `
    mutation UpdateUser($input: UpdateUserInputDto!) {
      updateUser(input: $input) {
        idUsers
        name
        email
        urlAvatar
        status
        updatedAt
      }
    }
  `;

  const payload = {
    idUsers: data.idUsers, 
    name: data.name,
  };

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        query: mutation,
        variables: { input: payload }
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("Erro no update:", result.errors);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro de rede:", error);
    return false;
  }
}