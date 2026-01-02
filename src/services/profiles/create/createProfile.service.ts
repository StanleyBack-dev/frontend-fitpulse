const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GRAPHQL_ENDPOINT = `${API_URL.replace(/\/$/, '')}/graphql`;

export interface CreateProfileInput {
  idUsers: string;
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

export async function createMyProfile(data: CreateProfileInput): Promise<boolean> {
  const mutation = `
    mutation CreateProfile($input: CreateProfileInputDto!) {
      createProfile(input: $input) {
        idProfiles
        enterprise
        position
      }
    }
  `;

  const payload = {
    idUsers: data.idUsers,
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
      credentials: 'include',
      body: JSON.stringify({ 
        query: mutation,
        variables: { input: payload }
      }),
    });

    const result = await response.json();

    if (result.errors) {
      return false;
    }

    return true;

  } catch (error) {

    return false;
  }
}