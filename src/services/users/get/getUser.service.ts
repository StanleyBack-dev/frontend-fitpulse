const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_URL.replace(/\/$/, '')}/graphql`;

export interface UserProfile {
  idUsers: string;
  name: string;
  email: string;
  urlAvatar?: string;
  userRole?: string;
}

export async function getMyUser(): Promise<UserProfile | null> {
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
      credentials: 'include', 
      body: JSON.stringify({ query }),
    });

    if (!response.ok) return null;

    const result = await response.json();

    if (result.errors) {
      return null;
    }

    return result.data.me;

  } catch (error) {

    return null;
  }
}